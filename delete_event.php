<?php

    // set up session

    require_once 'php/session.php';
    
    // set up connection to database via MySQLi

	require_once 'php/database.php';
	
	// get user ID using ONID from database

	require_once 'php/get_user.php';

	$userKey = getUserKeyFromDB($_SESSION['user'], $database);
	
    // get data from POST request 

	$eventKey = $_POST["key"];
	
	// delete event 

    $query = "DELETE FROM event WHERE hash = ? AND fk_event_creator = ?";
    $statement = $database -> prepare($query);
    $statement -> bind_param("si", $eventKey, $userKey);

    if(!$statement -> execute() || $database -> affected_rows < 1) {
		echo "The event could not be deleted.";
    }
    else {
		echo "The event was deleted successfully!";
    }

    $statement-> close();

?>
