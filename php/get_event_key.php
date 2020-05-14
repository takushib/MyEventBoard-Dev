<?php
  function getEventKey($slotKey, $database) {
    $query = "

              SELECT
                e.hash as 'key'
              FROM event AS e
              INNER JOIN timeslot t
                ON t.fk_event_id = e.id
              WHERE t.hash = ?
    ";

    $statement = $database->prepare($query);
    $statement->bind_param("s", $slotKey);
    $statement->execute();


    $result = $statement->get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $event_key = $result_array[0]['key'];

    $result -> free();

    return $event_key;
  }

?>
