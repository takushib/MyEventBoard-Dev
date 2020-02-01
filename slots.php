<?php

    // set up twig

    include 'php/twig.php';

    // set up connection to database via MySQLi

    include 'php/database.php';
    $event_id = 18;
    $statement = $database->prepare("SELECT * FROM Timeslot WHERE fk_event_id=?");
    $statement->bind_param("s", $event_id);
    if ($result = $database->query($statement)) {
      $slot_arr = [];
      $i = 0;
      while($obj = $result->fetch_object()) {
        $slot_arr[$i] = $obj;
        $i++;
      }
      echo json_encode($slot_arr);
    }


?>
