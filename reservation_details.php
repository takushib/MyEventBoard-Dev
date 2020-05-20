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

    $slotKey = ($_GET["key"]);

    // get event information and time slot reservation information from database 
    // using time slot key and user ONID
    // if there are no results, show error 404 

    $query = "

        SELECT 
            t3.hash, t3.name, t3.location, t3.description, t3.enable_upload AS 'upload',
            CONCAT(t4.first_name, ' ', t4.last_name) AS 'creator',
            t1.start_time, t1.end_time, t5.path AS 'file'
        FROM 
            booking AS t0
        INNER JOIN timeslot AS t1
            ON t0.fk_timeslot_id = t1.id
        INNER JOIN user AS t2
            ON t0.fk_user_id = t2.id
        INNER JOIN event AS t3
            ON t1.fk_event_id = t3.id
        INNER JOIN user AS t4
            ON t3.fk_event_creator = t4.id 
        LEFT JOIN files AS t5
            ON t0.id = t5.fk_booking_id
        WHERE t1.hash = ? AND t2.onid = ?

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("ss", $slotKey, $_SESSION['user']);
    $statement -> execute();

    $result = $statement -> get_result();
    $resultRow = $result -> fetch_assoc();

    if ($resultRow == NULL) {
        $errorCode = 404;
        render_error($twig, $errorCode, $errorMessages[$errorCode]);
        exit;
    }

    $reservationData = $resultRow;

    $result -> free();


    // render page using twig

    echo $twig -> render(
        'views/reservation_details.twig',
        [ 
            'event_key' => $reservationData['hash'], 
            'event_name' => $reservationData['name'], 
            'event_location' => $reservationData['location'],
            'event_description' => $reservationData['description'], 
            'event_creator' => $reservationData['creator'],
            'event_upload' => $reservationData['upload'],
            'slot_start' => $reservationData['start_time'],
            'slot_end' => $reservationData['end_time'],
            'user_file' => $reservationData['file']
        ]
    );

?>
