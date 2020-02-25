<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';

    // get invitation data from database

    $query = "
        
        SELECT 
            t1.onid AS 'ONID',
            t2.name AS 'Event Name',
            t3.onid AS 'Event Creator\'s ONID',
            t0.fk_event_id
        FROM 
            Invitations AS t0
        INNER JOIN 
            User AS t1 
            ON t1.id = t0.fk_user_id
        INNER JOIN 
            Event AS t2 
            ON t2.id = t0.fk_event_id
        INNER JOIN 
            User AS t3 
            ON t3.id = t2.fk_event_creator

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
        'views/invites_index.twig', 
        [
            'user_ONID' => $_SESSION['user'],
            'table_headers' => $result_keys, 
            'table_rows' => $result_array
        ]
    ); 

?>