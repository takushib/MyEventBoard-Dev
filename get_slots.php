<?php

    // set up connection to database via MySQLi

	require 'php/database.php';
	
	// get time slot data for event from database

	if (!empty($_POST))
	{
		$eventKey = $_POST("eventHash");

		$query = "

			SELECT * FROM timeslot 
			INNER JOIN event 
				ON timeslot.fk_event_id = event.id 
			WHERE event.hash = ?
		
		";

		$statement = $database -> prepare($query);
		$statement -> bind_param("s", $eventKey);
		
		if ($result = $database->query($statement)) {
			$slot_array = [];
			$i = 0;
			while($result_object = $result -> fetch_object()) {
				$slot_array[$i] = $result_object;
				$i++;
			}
		  	echo ($eventKey);
		}
	}

?>
