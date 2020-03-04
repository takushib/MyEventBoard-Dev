<?php 

// set up connection to database via MySQLi

require_once 'php/database.php';

// check if user is in database

$query = 'SELECT * FROM User WHERE onid = ?';

$statement = $database -> prepare($query);
$statement -> bind_param('s', $_SESSION['user']);
$statement -> execute();

$result = $statement -> get_result();

// if user is not in database, add user to database

if ($result -> num_rows < 1) {

    $query = '
        
        INSERT INTO 
            User(onid, email, last_name, first_name) 
        VALUES 
            (?, ?, ?, ?)
    
    ';

    $statement = $database -> prepare($query);
    
    $statement -> bind_param(
        "ssss",
        $_SESSION['user'],
        $_SESSION['email'],
        $_SESSION['lastName'],
        $_SESSION['firstName']
    );

    $statement -> execute();
    $result = $statement -> get_result();

    // for some reason, page content does not load after adding user
    // force refresh here

    $location = $_SERVER['REQUEST_URI'];
    header('Location: $location');

}

$result -> free();

?>