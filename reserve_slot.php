<?php

    // set up connection to database via MySQLi

    require 'php/database.php';

    // get user ID using ONID from database

    require_once 'php/get_user.php';

	$user_key = getUserKeyFromDB($_POST['userONID'], $database);

    // reserve time slot for event using stored procedure

    $slot_key = $_POST["key"];

    $query = 'CALL insert_booking(?, ?, @res1)';

    $statement = $database -> prepare($query);
    $statement -> bind_param("ii", $slot_key, $user_key);
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
        $statement2->bind_param("i", $user_key);
        $statement2->execute();
        $res = $statement2->get_result();
        $user = $res->fetch_object();
        $format = "Hi %s,\nYou have successfully reserved a timeslot.\n";
        $headers = "From: MyEventBoard" . "\r\n";
        $msg = sprintf($format, $user->first_name);
        mail($user->email,"Confirmation",$msg,$headers);
	  
	}

?>
