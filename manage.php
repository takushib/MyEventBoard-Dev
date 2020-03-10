<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

	require_once 'php/twig.php';

    // get key for event from URL

    $event_key = ($_GET["key"]);

    // get event name and match user ONID with event creator's ONID
    // if there are no results, show error page

    $query = "

        SELECT Event.name
        FROM Event 
        INNER JOIN User ON Event.fk_event_creator = User.id 
        WHERE Event.id = ? AND User.onid = ?

    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("is", $event_key, $_SESSION['user']);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_row = $result -> fetch_assoc();

    if ($result_row == NULL) {
        echo $twig -> render('views/404.twig');
        exit;
    }

    $event_name = $result_row['name'];

    $result -> free();

    // get event data from database

    $query = "
        
        SELECT
            t1.start_time AS 'Time Slot Start Time',
            CONCAT(t2.first_name, ' ', t2.last_name) AS 'Attendee Name',
            t2.onid AS 'Attendee ONID',
            t3.name AS 'Event Name'
        FROM 
            Bookings AS t0
        INNER JOIN Timeslot AS t1
            ON t0.fk_timeslot_id = t1.id
        INNER JOIN User AS t2
            ON t0.fk_user_id = t2.id
        INNER JOIN Event AS t3
            ON t1.fk_event_id = t3.id
        WHERE 
            t3.id = ?
        ORDER BY
            t1.start_time AND t2.first_name
    
    ";

    $statement = $database -> prepare($query);
    $statement -> bind_param("i", $event_key);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);
    $result_keys = array_keys($result_array[0]);

    $result -> free();
    $database -> close();

    // render page using twig

    echo $twig -> render(
        'views/manage.twig',
        [
            'user_ONID' => $_SESSION['user'],
            'event_name' => $event_name,
            'event_key' => $event_key,
            'table_headers' => $result_keys,
            'table_rows' => $result_array
        ]
    );

?>
