<?php

    // set up session

    require_once 'php/session.php';

    // set up connection to database via MySQLi

    require_once 'php/database.php';

    $upload_dir = '../../MEBuploads/';
    if ( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }
    else {
        $path = $upload_dir . $_FILES['file']['name'];
        echo $path;
        move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir . $_FILES['file']['name']);
    }
?>
