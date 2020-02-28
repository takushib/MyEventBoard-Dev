<?php

	// set up connection to database via MySQLi

	include 'php/database.php';

	// reserve time slot for event using stored procedure

	$slot_id = $_POST["key"];
	$user_id = $_POST["user_id"];
	$date = $_POST["date"];
	$s_time = $_POST["start_time"];
	$duration = $_POST["duration"];

  $query = 'CALL insert_booking(?, ?, @res1)';

	$statement = $database -> prepare($query);
	$statement -> bind_param("ii", $slot_id, $user_id);
	$statement -> execute();

	// stored procedure returns number of remaining spaces
	// get that value and use it as response to request later

	$query = "SELECT @res1";
	$result = $database -> query($query);
	$row = $result -> fetch_array(MYSQLI_NUM);
  echo $row[0];

  // send confirmation e-mail if successful

  if ($row[0] != -1) {
    $queryUser = 'SELECT email, first_name FROM User WHERE id = ?';
    $statement2 = $database->prepare($queryUser);
    $statement2->bind_param("i", $user_id);
    $statement2->execute();
    $res = $statement2->get_result();
    $user = $res->fetch_object();
    $format = "Hi %s,\n\nYou have successfully reserved a timeslot.\nDate: %s\nTime: %s\nDuration: %s\nLocation: Kelley\n";
    $headers = "From: MyEventBoard";
    // . "\r\n" .
    // "CC: louiesi@oregonstate.edu, liaoto@oregonstate.edu";
    $msg = sprintf($format, $user->first_name, $date, $s_time, $duration);
    mail($user->email,"Confirmation",$msg,$headers);
  }

?>
