<?php

    // set up connection to database via MySQLi

	require 'php/database.php';
	
	// get time slot data for event from database

	if (!empty($_POST))
	{
		$event_id = $_POST("fk_event");

		$statement = $database -> prepare("SELECT * FROM timeslot WHERE fk_event_id = ?");
		$statement -> bind_param("i", $event_id);
		
		if ($result = $database->query($statement)) {
			$slot_array = [];
			$i = 0;
			while($result_object = $result -> fetch_object()) {
				$slot_array[$i] = $result_object;
				$i++;
			}
		  	echo ($event_id);
		}
	}

?>
