<?php

  include 'php/database.php';

  $slot_id = $_POST["eid"];

  $query = 'DELETE FROM Event where id = ?';
  $statement = $database -> prepare($query);
	$statement -> bind_param("i", $slot_id);
  if(!$statement->execute()) {
    echo "Server Error: Unable to delete event.";
  }
  else {
    echo "Event(s) deleted successfully!";
    //echo $slot_id;
  }
  $statement->close();
?>
