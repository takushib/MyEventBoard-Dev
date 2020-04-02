<?php

    require_once 'php/database.php';
    require_once 'php/session.php';

    $eventKey = $_POST["key"];
    $query = "
                DELETE b
                FROM booking as b
                INNER JOIN timeslot t ON t.id = b.fk_timeslot_id
                INNER JOIN event e ON e.id = t.fk_event_id
                INNER JOIN user u ON u.id = b.fk_user_id
                WHERE e.hash = ? AND u.onid = ?
    ";
    $statement = $database -> prepare($query);
    $statement -> bind_param("ss", $eventKey, $_SESSION['user']);
    if(!$statement -> execute()) {
      echo "ERROR: The reservation(s) could not be deleted!";
    }
    else {
      echo "Reservation(s) deleted successfully!";
    }

    $statement->close();

?>
