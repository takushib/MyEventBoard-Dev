<?php

    // set up twig

    require 'vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem('my_invites_templates');
    $twig = new Twig_Environment($loader);

    // set up connection to database via MySQLi

    include 'php/database.php';

    // get invitation data from database

    $query = "
        
        SELECT
            user AS 'ONID',
            event_name AS 'Event Name',
            event_creator AS 'Event Creator\'s ONID',
            event_id AS 'Event ID'
        FROM
            invite_list

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
        ['table_headers' => $result_keys, 'table_rows' => $result_array]
    ); 

?>