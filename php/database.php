<?php

    // information for connecting to database

    $host = 'classmysql.engr.oregonstate.edu';
    $userName = 'takushib_capstone2019';
    $database = 'takushib_capstone2019';

    $passwordFile = fopen('text_file', 'r'); // account password should be in file
    $password = fgets($passwordFile);
    fclose($passwordFile);

    // create connection to database

    $database = new mysqli($host, $userName, $password, $database);

    // check if that was successful
    // application is completely dependent on database so dying is acceptable

    if ($database -> connect_error)
        die('A connection to the database could not be estabished.');

?>