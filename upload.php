<?php

    // set up session
    require_once 'php/session.php';

    // set up connection to database via MySQLi
    require_once 'php/database.php';

    require_once 'php/get_booking_id.php';
    require_once 'php/get_event_key.php';

    $slotKey = $_POST['slotKey'];
    $eventKey  = getEventKey($slotKey, $database);

    $user = $_SESSION['user'];

    $booking_id = getBookingID($user, $slotKey, $database);

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
                    VALUES (?,?)"
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
