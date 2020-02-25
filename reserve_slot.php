<?php

	// set up connection to database via MySQLi

	include 'php/database.php';

	// reserve time slot for event using stored procedure

	$slot_id = $_POST["key"];
	$user_id = $_POST["user_id"];

	$query = 'CALL insert_booking(?, ?, @res1)';

	$statement = $database -> prepare($query);
	$statement -> bind_param("ii", $slot_id, $user_id);
	$statement -> execute();

	// stored procedure returns number of remaining spaces
	// get that value and use it as response to request

	$query = "SELECT @res1";
	$result = $database -> query($query);
	$row = $result -> fetch_array(MYSQLI_NUM);
	echo $row[0]; 
  
?>
