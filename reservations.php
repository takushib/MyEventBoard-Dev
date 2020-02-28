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
            t2.name AS 'Event Name', 
            t1.start_time AS 'Start Time',
            CONCAT(t4.first_name, ' ', t4.last_name) AS 'Creator Name',
            t4.onid AS 'Creator ONID',
            t2.id AS 'Event ID'
        FROM 
            Bookings AS t0
        INNER JOIN Timeslot AS t1 
            ON t0.fk_timeslot_id = t1.id 
        INNER JOIN Event AS t2 
            ON t1.fk_event_id = t2.id
        INNER JOIN User AS t3
            ON t0.fk_user_id = t3.id
        INNER JOIN User AS t4
            ON t2.fk_event_creator = t4.id
        WHERE t3.onid = ?

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $_SESSION['user']);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $result_keys = array_keys($result_array[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/reservations.twig', 
        [
            'user_ONID' => $_SESSION['user'],
            'table_headers' => $result_keys, 
            'table_rows' => $result_array
        ]
    ); 

?>