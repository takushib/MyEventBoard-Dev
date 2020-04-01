<?php

    // set up connection to database via MySQLi

    require 'php/database.php';

    // get user ID using ONID from database

    require_once 'php/get_user.php';

	$userKey = getUserKeyFromDB($_POST['userONID'], $database);


	// get slot ID using hash associated with that slot

	$slotKey = $_POST["key"];

	$query = 'SELECT * FROM timeslot WHERE hash = ?';

	$statement = $database -> prepare($query);
    $statement -> bind_param("s", $slotKey);
	$statement -> execute();

    $result = $statement -> get_result();
	$resultRow = $result -> fetch_assoc();

	$slotID = $resultRow['id'];


    // reserve time slot for event using stored procedure

	$query = 'CALL reserve_slot(?, ?, @res1)';

    $statement = $database -> prepare($query);
    $statement -> bind_param("ii", $slotID, $userKey);
	$statement -> execute();


	// stored procedure returns number of remaining spaces
	// get that value and use it as response to request later

	$query = "SELECT @res1";
	$result = $database -> query($query);
	$row = $result -> fetch_array(MYSQLI_NUM);
	echo $row[0];


	// send confirmation e-mail if successful

	if ($row[0] != -1) {

		$date = $_POST["date"];
		$s_time = $_POST["start_time"];
		$duration = $_POST["duration"];

		$queryUser = 'SELECT email, first_name FROM user WHERE id = ?';
		$statement2 = $database->prepare($queryUser);
		$statement2->bind_param("i", $userKey);
		$statement2->execute();
		$res = $statement2->get_result();
		$user = $res->fetch_object();

		// fetch location

		$queryLoc = "

			SELECT
				E.location AS 'location'
			FROM timeslot
			INNER JOIN event E
				ON timeslot.fk_event_id = E.id
			WHERE timeslot.hash = ?

		";

		$locStatement = $database->prepare($queryLoc);
		$locStatement->bind_param("s", $slotKey);
		$locStatement->execute();
		$locRes = $locStatement->get_result();
		$locationObj = $locRes->fetch_object();

		// create then send e-mail

		$format = "Hi %s,\n\nYou have successfully reserved a timeslot.\n\nDate: %s\nTime: %s\nDuration: %s\nLocation: %s\n";
		$headers = "From: MyEventBoard" . "\r\n";
		$msg = sprintf($format, $user->first_name, $date, $s_time, $duration, $locationObj->location);
		mail($user->email,"Confirmation", $msg, $headers);

	}

?>
