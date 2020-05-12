<?php
  function getBookingID($ONID, $slotKey, $database) {
    $query = "

              SELECT
                b.id AS 'key'
              FROM booking AS b
              INNER JOIN timeslot t
                ON t.id = b.fk_timeslot_id
              INNER JOIN user u
                ON u.id = b.fk_user_id
              WHERE t.hash = ? AND u.onid = ?
    ";

    $statement = $database->prepare($query);
    $statement->bind_param("ss", $slotKey, $ONID);
    $statement->execute();


    $result = $statement->get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $booking_id = $result_array[0]['key'];

    $result -> free();

    return $booking_id;
  }

?>
