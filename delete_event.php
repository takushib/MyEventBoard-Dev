<?php

    include 'php/database.php';

    $eventKey = $_POST["key"];

    $query = "DELETE FROM event WHERE hash = ?";
    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);
    
    if(!$statement -> execute()) {
      echo "ERROR: The event(s) could not be deleted.";
    }
    else {
      echo "Event(s) deleted successfully!";
    }

    $statement->close();

?>
