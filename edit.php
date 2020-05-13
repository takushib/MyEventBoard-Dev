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

    // get event and time slot data

    $query = "

        SELECT 
            t0.hash AS 'eventHash', t0.name, t0.description, 
            t0.location, t1.onid AS 'creator', t2.hash AS 'slotHash', 
            t2.start_time AS 'startTime', t2.end_time AS 'endTime', 
            t2.duration, t2.slot_capacity AS 'capacity', 
            t0.is_anon AS 'anonymous', t0.enable_upload as 'upload' 
        FROM event AS t0
        INNER JOIN user AS t1
            ON t0.fk_event_creator = t1.id
        INNER JOIN timeslot AS t2
            ON t0.id = t2.fk_event_id 
        WHERE t0.hash = ?
        ORDER BY t2.start_time ASC

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("s", $eventKey);
    $statement -> execute();

    $result = $statement -> get_result();

    $resultObjects = [];

    while (1) {
        $resultObject = $result -> fetch_object();
        if ($resultObject == NULL) break;
        $resultObjects[] = $resultObject;
    }


    // check results
    // if there are no results, show eror 404
    // if there are results or if current user is not event creator, show error 403

    $errorCode = 0;

    if ($resultObjects == NULL) {
        $errorCode = 404;
    }
    else if ($resultObjects[0]->creator != $_SESSION['user']) {
        $errorCode = 403;
    }

    if ($errorCode != 0) {
        render_error($twig, $errorCode, $errorMessages[$errorCode]);
        exit;
    }


    // encode array of PHP objects as JSON

    $eventData = [];

    foreach ($resultObjects as $resultObject) {
        $eventData[] = json_encode($resultObject);
    }


    // render page using twig

    echo $twig -> render(
        'views/edit.twig',
        [ 'event_data' => $eventData ]
    );

?>
