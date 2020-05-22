<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';

    // get user ID using ONID from database

    require_once 'php/get_user.php';

    $userKey = getUserKeyFromDB($_SESSION['user'], $database);
 
    // get event data from database

    $query = "
    
        SELECT
            event.hash AS 'Event Key',
            event.name AS 'Event',
			event.open_slots AS 'Available Slots',
            event.capacity AS 'Capacity'
        FROM 
            event, user
        WHERE
            user.id = ? AND event.fk_event_creator = user.id
        ORDER BY
			event.name
    ";
        
    $statement = $database -> prepare($query);
    $statement -> bind_param('i', $userKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
    $resultKeys = array_keys($resultArray[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/events.twig', 
        [
            'user_ONID' => $_SESSION['user'],
            'table_headers' => $resultKeys, 
            'table_rows' => $resultArray
        ]
    ); 

?>
