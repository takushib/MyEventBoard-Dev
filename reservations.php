<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';

    // get data for time slots reserved by user from database

    $query = "

        SELECT
            t2.name AS 'Event',
            t1.start_time AS 'Start Time',
            t2.location AS 'Location',
            t2.hash AS 'Event Key',
            t1.hash AS 'Time Slot Key'
        FROM
            booking AS t0
        INNER JOIN timeslot AS t1
            ON t0.fk_timeslot_id = t1.id
        INNER JOIN event AS t2
            ON t1.fk_event_id = t2.id
        INNER JOIN user AS t3
            ON t0.fk_user_id = t3.id
        INNER JOIN user AS t4
            ON t2.fk_event_creator = t4.id
        WHERE t3.onid = ?
        ORDER BY
            t1.start_time

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $_SESSION['user']);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
    $resultKeys = array_keys($resultArray[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/reservations.twig',
        [
            'table_headers' => $resultKeys,
            'table_rows' => $resultArray
        ]
    );

?>
