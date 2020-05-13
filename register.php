<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';
    
    // include code for rendering view for errors

    require_once 'php/render_error.php';


    // get key for event from URL

    $eventKey = ($_GET["key"]);

    // get event data from database

    $query = 'SELECT name FROM event WHERE hash = ?';

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultRow = $result -> fetch_assoc();

    // if event data could not be found, show error page

    if ($resultRow == NULL) {
        $errorCode = 404;
        render_error($twig, $errorCode, $errorMessages[$errorCode]);
        exit;
    }

    $eventName = $resultRow['name'];

    $result -> free();

    // get time slot data for event from database

    $query = "

        SELECT 
            T.hash, T.start_time, T.duration, 
            T.slot_capacity, T.spaces_available, T.is_full, 
            E.description, E.location, 
            IF(U.onid = ?, TRUE, FALSE)
        FROM timeslot T
        INNER JOIN event E 
            ON T.fk_event_id = E.id
        LEFT JOIN booking B
            ON T.id = B.fk_timeslot_id
        LEFT JOIN user U 
            ON B.fk_user_id = U.id
        WHERE E.hash = ?

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("ss", $_SESSION['user'], $eventKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
    $resultKeys = array_keys($resultArray[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/register.twig',
        [
            'event_name' => $eventName,
            'table_headers' => $resultKeys,
            'table_rows' => $resultArray
        ]
    );

?>
