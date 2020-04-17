<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';

    // get email function

    require_once 'php/notify_user.php';

    // get data from POST request

    $eventHash = $_POST['eventHash'];
    $added_slots = json_decode($_POST['addedSlots'], true);
    $deleted_slots = json_decode($_POST['deletedSlots'], true);

    // initialize error codes
    
    $insertSuccess = TRUE;
    $deleteSuccess = TRUE;

    // delete slots if slots exist
    
    if (count($deleted_slots) > 0) {
        foreach($deleted_slots as $slot) {
        
            // query for existing reservations
            
            $emailQuery = "
                SELECT u.email, u.first_name FROM timeslot t
                INNER JOIN booking b
                ON t.id = b.fk_timeslot_id
                INNER JOIN user u
                ON b.fk_user_id = u.id
                WHERE t.hash = ?
            ";

            $statement = $database->prepare($emailQuery);
            $statement->bind_param("s", $slot['hash']);
            $statement->execute();
            $emailResult = $statement->get_result();

            // date query

            $dateQuery = "SELECT mod_date FROM event WHERE hash = ?";
            $statement = $database->prepare($dateQuery);
            $statement->bind_param('s', $eventHash);
            $statement->execute();
            $dateResult = $statement->get_result();
            $result_array = $dateResult->fetch_all(MYSQLI_ASSOC);
            $oldModDate = $result_array[0]['mod_date'];

            // call procedure

            $deleteQuery = 'CALL delete_slot(?, ?, ?, @res3)';
            $delete_statement = $database->prepare($deleteQuery);
            $delete_statement->bind_param("sss", $oldModDate, $eventHash, $slot['hash']);
            $delete_statement->execute();

            $resultQuery = "SELECT @res3";
            $deleteResult = $database->query($resultQuery);
            $row = $result -> fetch_array(MYSQLI_NUM);

            if($row != 0) {
                $deleteSuccess = FALSE;
            }
        
            // build URL that leads to sign-up page for event
            $developerONID = substr(getcwd(), strlen('/nfs/stak/users/'), -1 * strlen('/public_html/MyEventBoard'));
            $siteURL = 'http://web.engr.oregonstate.edu/~' . $developerONID . '/MyEventBoard/';
            $siteURL = $siteURL . 'register?key=' . $eventHash;

            // email users who were kicked off after slot was successfully deleted
            if ($emailResult && ($deleteSuccess == TRUE)) {
                $removed_users = $result->fetch_all(MYSQLI_ASSOC);
                emailUsers($removed_users, $siteURL);
            }

        }
    }

    // add slots if slots exist

    if (count($added_slots) > 0) {
        foreach($added_slots as $slot) {

            $dateQuery = "SELECT mod_date, id FROM event WHERE hash = ?";
            $statement = $database->prepare($dateQuery);
            $statement->bind_param('s', $eventHash);
            $statement->execute();
            $result = $statement->get_result();
            $result_array = $result->fetch_all(MYSQLI_ASSOC);
            $oldModDate = $result_array[0]['mod_date'];
            $eventKey = $result_array[0]['id'];

            $bigString = $slot['start_date'] + $slot['end_date'] + $eventKey + time();
            $slotHash = password_hash($bigstring, PASSWORD_BCRYPT);

            $insert_query = 'CALL add_slot(?, ?, ?, ?, ?, ?, ?, @res2)';
            $insert_statement = $database->prepare($insert_query);
            $insert_statement->bind_param('sssssii', 
            $oldModDate, $eventHash, $slotHash, $slot['start_date'], $slot['end_date'], $slot['duration'], $slot['slot_capacity']);
            $insert_statement->execute();

            $resultQuery = "SELECT @res2";
            $addResult = $database->query($resultQuery);
            $row = $result -> fetch_array(MYSQLI_NUM);
            
            if($row != 0) {
                $insertSuccess = FALSE;
            }

        }
    }


    // response to front end 

    if($insertSuccess && $deleteSuccess) {
        echo "Event successfully edited!";
    }
    else {

        $errorCode = -1; // placeholder error code, means nothing

        if ($insertSuccess && ($deleteSuccess == FALSE)) {
            $errorCode = 2;
        }
        elseif (($insertSuccess == FALSE)) && $deleteSuccess) {
            $errorCode = 1;
        }
        else {
            $errorCode = 3;
        }

        echo "Unable to edit event\nError Code: " + $errorCode;

    }

?>
