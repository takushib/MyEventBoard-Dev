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
            Event.id AS 'Event ID',
            Event.name AS 'Name',
            User.onid AS 'Creator',
            Event.capacity AS 'Capacity',
            Event.open_slots AS 'Available Slots'
        FROM 
            Event, User
        WHERE
            User.id = ? AND
            Event.fk_event_creator = User.id
        
    ";
        
    $statement = $database -> prepare($query);
    $statement -> bind_param('s', $userKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $result_keys = array_keys($result_array[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/events.twig', 
        [
            'user_ONID' => $_SESSION['user'],
            'table_headers' => $result_keys, 
            'table_rows' => $result_array
        ]
    ); 

?>
