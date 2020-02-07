<?php

  include 'php/database.php';

  $slot_id = $_POST["key"];
  $user_id = $_POST["user_id"];

  $query = 'CALL insert_booking(?, ?, @res1)';

  $statement = $database->prepare($query);
  $statement->bind_param("ii", $slot_id, $user_id);
  $statement->execute();

  $sql = "SELECT @res1";
  $result = $database->query($sql);
  $row = $result->fetch_array(MYSQLI_NUM);
  echo $row[0];
  
?>
