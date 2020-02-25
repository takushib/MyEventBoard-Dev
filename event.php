<?php

    // set up connection to database via MySQLi

    include 'php/database.php';

	// insert event data and time slot data into database
	// if something was submitted via HTTP POST

    if (!empty($_POST)) {
		
		$slots = json_decode($_POST['slotArray'], true);

		$statement = $database -> prepare("

			INSERT INTO Event 
				(name, description, fk_event_creator, location, capacity, open_slots) 
			VALUES (?, ?, ?, ?, ?, ?)
			
		");

		$statement -> bind_param(
			"ssisii", 
			$eName, $eDescription, $eCreator, $eLocation, $eCapacity, $eOpenSlots
		);

		$eName = $_POST['eventName'];
		$eDescription = $_POST['eventDescription'];
		$eCreator = $_POST['eventCreator'];
		$eLocation = $_POST['eventLocation'];
		$eCapacity = $_POST['eventCap'];
		$eOpenSlots = $eCapacity;

		$statement -> execute();

		$newEventID = $database -> insert_id;


		$statement = $database -> prepare("

			INSERT INTO Timeslot 
				(start_time, end_time, duration, slot_capacity, spaces_available, is_full, fk_event_id) 
			VALUES (?, ?, ?, ?, ?, ?, ?)

		");

		$statement -> bind_param(
			"ssiiiii", 
			$sStartDate, $sEndDate, $sDuration, $sCapacity, $sSpaces, $sFull, $sEventID
		);
		
		foreach($slots as $item){

			$sStartDate = $item['startDate'];
			$sEndDate = $item['endDate'];
			$sDuration = $_POST['eventDuration'];
			$sCapacity = $_POST['sCap'];
			$sSpaces = $_POST['sCap'];
			$sFull = 0;
			$sEventID = $newEventID;

			$statement -> execute();

		}
		  
		$statement -> close();

		echo "DEBUG: Data has been submitted!";
		exit;

    }

?>
