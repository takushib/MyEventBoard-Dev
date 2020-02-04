<?php

    // set up twig

    require 'vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem('register_templates');
    $twig = new Twig_Environment($loader);

    // set up connection to database via MySQLi

    include 'php/database.php';

    // get event data from database

    $query = 'SELECT name FROM Event WHERE id = 30';

    $statement = $database -> prepare($query);
    $statement -> execute();

    $result = $statement -> get_result();
    $result_row = $result -> fetch_assoc();
    $event_name = $result_row['name'];

    $result -> free();

    // get time slot data for event from database

    $query = "
<<<<<<< HEAD

        SELECT
        start_time, duration, slot_capacity, spaces_available, is_full 
        FROM Timeslot
=======
    
        SELECT start_time, duration, slot_capacity, spaces_available, is_full
        FROM Timeslot 
>>>>>>> 77a0c480063f9793bc4eff11a60ece0757e83fac
        WHERE fk_event_id = 30

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
        'views/register_index.twig',
        [
            'event_name' => $event_name,
            'table_headers' => $result_keys,
            'table_rows' => $result_array
        ]
    );

?>
