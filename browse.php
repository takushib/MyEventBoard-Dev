<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';

    // get event data from database

    $query = "
        
        SELECT
            t0.name AS 'Event Name', 
            t0.open_slots AS 'Open Slots',
            CONCAT(t1.first_name, ' ', t1.last_name) AS 'Creator Name',
            t1.onid AS 'Creator ONID',
            t0.id AS 'Event ID'
        FROM 
            event AS t0
        INNER JOIN user AS t1
            ON t0.fk_event_creator = t1.id

    ";

    $statement = $database -> prepare($query);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $result_keys = array_keys($result_array[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/browse.twig', 
        [
            'user_ONID' => $_SESSION['user'],
            'table_headers' => $result_keys, 
            'table_rows' => $result_array
        ]
    );

?>