<?php

	// set up session

	require_once 'php/session.php';

	// set up connection to database via MySQLi

	require_once 'php/database.php';

	// get data from POST request

	$slotKey = $_POST["key"];

	// delete reservation

	$query = "CALL delete_reservation(?, ?, @res1)";
	$statement = $database -> prepare($query);
	$statement -> bind_param("ss", $slotKey, $_SESSION['user']);
	$query = "SELECT @res1";
	$result = $database -> query($query);
	$row = $result -> fetch_array(MYSQLI_NUM);


	if(!$statement -> execute() || $row[0] != 0) {
		echo "The reservation could not be deleted!";
	}
	else {
		echo "The reservation was deleted successfully!";
	}

	$statement -> close();

?>
