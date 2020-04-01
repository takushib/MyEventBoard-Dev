<?php

    include 'php/database.php';

    $eventKey = $_POST["key"];

    $query = "DELETE FROM booking WHERE hash = ?";
    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);

    if(!$statement -> execute()) {
      echo "ERROR: The reservation(s) could not be deleted!";
    }
    else {
      echo "Reservation(s) deleted successfully!";
    }

    $statement->close();

?>
