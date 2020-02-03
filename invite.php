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
            Invitations.id AS 'Invitation ID', 
            User.onid AS 'ONID', 
            Event.name AS 'Event Name'
        FROM 
            Invitations, User, Event 
        WHERE 
            Invitations.fk_user_id = User.id AND 
            Invitations.fk_event_id = Event.id

    ";

    $statement = $database -> prepare($query);
    $statement -> execute();

    $result = $statement -> get_result();

    $result_array = $result -> fetch_all(MYSQLI_ASSOC);

    $result_keys = array_keys($result_array[0]);

    // render page using twig

    echo $twig -> render(
        'views/invites_index.twig', 
        ['table_headers' => $result_keys, 'table_rows' => $result_array]
    ); 

?>