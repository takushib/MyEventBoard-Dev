<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    require_once 'php/get_booking_id.php';

    $slotKey = $_POST['slotKey'];
    $booking_id = getBookingID($_POST['user'], $slotKey, $database);
    echo $booking_id;
    $upload_dir = '../../MEBuploads/';
    if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        $path = $upload_dir . $_FILES['file']['name'];

        move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir . $_FILES['file']['name']);
        $statement = $database->prepare("
                  INSERT INTO files(path, fk_booking_id)
                  VALUES (?,?)"
        );

        $statement->bind_param("si", $path, $booking_id);
        $statement->execute();
        echo $database->insert_id;
    }
?>
