<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    // set up twig

    require_once 'php/twig.php';
    function emailUsers($users) {
      foreach($users as $user) {
        $query = "SELECT email, first_name FROM user WHERE onid = ?";

        $statement = $database -> prepare($query);

        $statement -> bind_param('s', $user);
        $statement -> execute();

        $result = $statement -> get_result();
        $result_array = $result -> fetch_all(MYSQLI_ASSOC);
        $user_name = $result_array[0]['first_name'];
        $user_email = $result_array[0]['email'];

        // format email message
        $format = "Hi %s,\n\nThe host for %s has removed the slot that you reserved.\n\n
                  Please sign up for an available slot by clicking the link below\n\n
                  %s";
        $headers = "From: MyEventBoard" . "\r\n";
        //$msg = sprintf($format, )
      }

    }

    $added_slots = json_decode($_POST['addedSlots'], true);
    $deleted_slots = json_decode($_POST['deletedSlots'], true);


    if (count($added_slots) > 0) {
      // add slots here
    }


    if (count($deleted_slots) > 0) {
      // delete slots here
    }
    echo "Event successfully edited!";













?>
