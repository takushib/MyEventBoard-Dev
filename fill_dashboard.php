<?php

    // set up connection to database via MySQLi

    require 'php/database.php';

    // get data for dashboard, including
    // user data, event data, time slot data
    
    $user_ONID = $_POST['userONID'];

    $q = "

        SELECT
            U.onid AS 'user',
            E.name AS 'event_name',
            E.location AS 'event_location',
            E.description AS 'event_description',
            T.start_time AS 'start_time',
            T.end_time as 'end_time',
            T.duration as 'slot_duration',
            T.spaces_available as 'slots_remaining',
            U1.first_name as 'ec_first_name',
            U1.last_name as 'ec_last_name'
        FROM Bookings
        INNER JOIN 
            User U on Bookings.fk_user_id = U.id
        INNER JOIN 
            Timeslot T on Bookings.fk_timeslot_id = T.id
        INNER JOIN 
            Event E on T.fk_event_id = E.id
        INNER JOIN 
            User U1 on E.fk_event_creator = U1.id
        WHERE U.onid = ?

    ";

    $statement = $database->prepare($q);
    $statement->bind_param("s", $user_ONID);
    $statement->execute();
    
    $result = $statement->get_result();
    $result_array = $result -> fetch_all(MYSQLI_ASSOC);

    echo json_encode($result_array);

?>