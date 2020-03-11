<?php

    // set up connection to database via MySQLi

	require_once 'php/database.php';
	
	// get user ID using ONID from database

    require_once 'php/get_user.php';

	$userKey = getUserKeyFromDB($_POST['eventCreator'], $database);
	
	// insert event data and time slot data into database
	// if something was submitted via HTTP POST

    if (!empty($_POST)) {
		
		$slots = json_decode($_POST['slotArray'], true);

		$statement = $database -> prepare("

			INSERT INTO 
				event(hash, name, description, fk_event_creator, location, capacity, open_slots) 
			VALUES (?, ?, ?, ?, ?, ?, ?)
			
		");

		$statement -> bind_param(
			"sssisii", 
			$eHash, $eName, $eDescription, $eCreator, $eLocation, $eCapacity, $eOpenSlots
		);

		$eName = $_POST['eventName'];
		$eDescription = $_POST['eventDescription'];
		$eCreator = $userKey;
		$eLocation = $_POST['eventLocation'];
		$eCapacity = $_POST['eventCap'];
		$eOpenSlots = $eCapacity;

		$bigString = $eName + $eDescription + $eCreator + $eLocation + time();
		$eHash = password_hash($bigString, PASSWORD_BCRYPT);

		$statement -> execute();


		$newEventID = $database -> insert_id;

		$statement = $database -> prepare("

			INSERT INTO 
				timeslot(hash, start_time, end_time, duration, slot_capacity, spaces_available, is_full, fk_event_id) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)

		");

		$statement -> bind_param(
			"sssiiiii", 
			$sHash, $sStartDate, $sEndDate, $sDuration, $sCapacity, $sSpaces, $sFull, $sEventID
		);
		
		foreach($slots as $item){

			$sStartDate = $item['startDate'];
			$sEndDate = $item['endDate'];
			$sDuration = $_POST['eventDuration'];
			$sCapacity = $_POST['sCap'];
			$sSpaces = $_POST['sCap'];
			$sFull = 0;
			$sEventID = $newEventID;

			$bigString = $sStartDate + $sEndDate + $sEventID + time();
			$sHash = password_hash($bigString, PASSWORD_BCRYPT);

			$statement -> execute();

		}
		  
		$statement -> close();

		echo "Your event has been successfully created!";
		exit;

    }

?>
