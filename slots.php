<?php

    // set up twig

    include 'php/twig.php';

    // set up connection to database via MySQLi

    include 'php/database.php';
	if (!empty($_POST))
	{
		$event_id = $_POST("fk_event");;
		$statement = $database->prepare("SELECT * FROM Timeslot WHERE fk_event_id=?");
		$statement->bind_param("i", $event_id);
		if ($result = $database->query($statement)) {
		  $slot_arr = [];
		  $i = 0;
		  while($obj = $result->fetch_object()) {
			$slot_arr[$i] = $obj;
			$i++;
		  }
		  echo ($event_id);
		}
	}

?>
