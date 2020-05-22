<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // get user ID using ONID from database

    require_once 'php/get_user.php';

    $userKey = getUserKeyFromDB($_SESSION['user'], $database);


    // get data from POST request

    $eventKey = $_POST['eventHash'];
    $eventName = $_POST['eventName'];
    $eventLocation = $_POST['eventLocation'];
    $eventDescription = $_POST['eventDescription'];

    // events sign-up is anonymous by default
    // unless it is explicitly set to not be anonymous
    // assume it should be anonymous

    $isAnonymous = 1;
    if ($_POST['isAnonymous'] == "false") $isAnonymous = 0;

    // file upload is disabled by default
    // unless it is explicitly set to be enabled
    // assume it should be disabled

    $enableUpload = 0;
    if ($_POST['enableUpload'] == "true") $enableUpload = 1;


    // update database entry using given data

    $query = "

        UPDATE meb_event
        SET
            name = ?,
            description = ?,
            location = ?,
            is_anon = ?,
            enable_upload = ?
        WHERE hash = ? AND fk_event_creator = ?

    ";

    $statement = $database -> prepare($query);

    $statement -> bind_param(
        "sssiisi", $eventName, $eventDescription, $eventLocation,
        $isAnonymous, $enableUpload, $eventKey, $userKey
    );

    $statement -> execute();

    $result = $statement -> get_result();

    if ($database -> affected_rows == 1) {
        echo "The event details were successfully edited!";
    }
    else {
        echo "Something went wrong!";
    }

?>
