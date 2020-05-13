<?php

    require_once 'php/database.php';
    require_once 'php/session.php';

    $eventKey = $_POST["key"];
    $query = "CALL delete_slot(?, ?, @res1)";
    $statement = $database -> prepare($query);
    $statement -> bind_param("ss", $eventKey, $_SESSION['user']);
    $query = "SELECT @res1";
  	$result = $database -> query($query);
  	$row = $result -> fetch_array(MYSQLI_NUM);
  	echo $row[0];
    exit();
    if(!$statement -> execute()) {
      echo "ERROR: The reservation(s) could not be deleted!";
    }
    else {
      echo "Reservation(s) deleted successfully!";
    }

    $statement->close();

?>
