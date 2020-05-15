<?php

    // set up session
    
    require_once 'php/session.php';

    // set up connection to database via MySQLi
    
    require_once 'php/database.php';

    // include code for getting event key and ID of booking
    
    require_once 'php/get_booking_id.php';
    require_once 'php/get_event_key.php';

    // get time slot key from POST request

    $slotKey = $_POST['slotKey'];

    // save user ONID to new variable for convenience

    $user = $_SESSION['user'];

    // get ID of user's booking for time slot
    // if there is no booking, show user error message and abort now

    $booking_id = getBookingID($user, $slotKey, $database);

    if ($booking_id == -1) {
        echo "You have not reserved a time slot." . '\n';
        echo "File upload is not possible." . '\n';
        exit;
    }

    // get event key using time slot key

    $eventKey  = getEventKey($slotKey, $database);

    // continue with file upload

    $new_path = '../MEBuploads/' . $eventKey;
    $new_file_name = $user . '_upload';

    $old_file_name = $_FILES['file']['name'];
    $ext = pathinfo($old_file_name, PATHINFO_EXTENSION);
    $path = $new_path . '/' . $new_file_name . '.' . $ext;

    if (file_exists($new_path)) {
      // folder for event exists
      if ( 0 < $_FILES['file']['error'] ) {
          echo 'Error: ' . $_FILES['file']['error'] . '<br>';
      }
      else {
        move_uploaded_file($_FILES['file']['tmp_name'], $path);
        $statement = $database->prepare("
            INSERT INTO files(path, fk_booking_id)
            VALUES (?, ?)"
        );
        $path_to_store = '../' . $path;
        $statement->bind_param("si", $path_to_store, $booking_id);
        $statement->execute();
        echo $database->insert_id;
      }
    }
    else {
        // folder has not been made, create new one
        mkdir($new_path);
        if ( 0 < $_FILES['file']['error'] ) {
            echo 'Error: ' . $_FILES['file']['error'] . '<br>';
        }
        else {
            move_uploaded_file($_FILES['file']['tmp_name'], $path);
            $statement = $database->prepare("
                INSERT INTO files(path, fk_booking_id)
                VALUES (?,?)"
            );
            $path_to_store = '../' . $path;
            $statement->bind_param("si", $path_to_store, $booking_id);
            $statement->execute();
            echo $database->insert_id;
        }
    }

?>
