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

    // get event name
    // if there are no results, show error page

    $query = "

        SELECT event.name
        FROM event 
        INNER JOIN user 
            ON event.fk_event_creator = user.id 
        WHERE event.hash = ?

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultRow = $result -> fetch_assoc();

    if ($resultRow == NULL) {
        $errorCode = 404;
        render_error($twig, $errorCode, $errorMessages[$errorCode]);
        exit;
    }

    $eventName = $resultRow['name'];

    $result -> free();

    // get event data from database

    $query = "
        
        SELECT
            t1.start_time AS 'Time Slot Start Time',
            CONCAT(t2.first_name, ' ', t2.last_name) AS 'Attendee Name',
            t2.onid AS 'Attendee ONID',
            t3.name AS 'Event Name'
        FROM 
            booking AS t0
        INNER JOIN timeslot AS t1
            ON t0.fk_timeslot_id = t1.id
        INNER JOIN user AS t2
            ON t0.fk_user_id = t2.id
        INNER JOIN event AS t3
            ON t1.fk_event_id = t3.id
        WHERE 
            t3.hash = ?
        ORDER BY
            t1.start_time AND t2.first_name
    
    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
    $resultKeys = array_keys($resultArray[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/reservation_details.twig',
        [
            'event_name' => $eventName,
            'event_key' => $eventKey,
            'table_headers' => $resultKeys,
            'table_rows' => $resultArray
        ]
    );

?>
