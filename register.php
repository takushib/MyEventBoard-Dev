<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

	require_once 'php/twig.php';

    // get key for event from URL

    $event_key = ($_GET["key"]);

    // get event data from database

    $query = 'SELECT name FROM Event WHERE id = (?)';

    $statement = $database -> prepare($query);
    $statement -> bind_param("i", $event_key);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_row = $result -> fetch_assoc();

    // if event data could not be found, show error page

    if ($result_row == NULL) {
        echo $twig -> render('views/404.twig');
        exit;
    }

    $event_name = $result_row['name'];

    $result -> free();

    // get time slot data for event from database

    $query = "

        SELECT id, start_time, duration, slot_capacity, spaces_available, is_full
        FROM Timeslot
        WHERE fk_event_id = (?)

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
        'views/register.twig',
        [
            'user_ONID' => $_SESSION['user'],
            'event_name' => $event_name,
            'table_headers' => $result_keys,
            'table_rows' => $result_array
        ]
    );

?>
