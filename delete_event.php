<?php

    include 'php/database.php';

    $slot_key = $_POST["eid"];

    $query = 'DELETE FROM event where id = ?';
    $statement = $database -> prepare($query);
    $statement -> bind_param("i", $slot_key);
    
    if(!$statement->execute()) {
      echo "ERROR: The event(s) could not be deleted.";
    }
    else {
      echo "Event(s) deleted successfully!";
    }

    $statement->close();

?>
