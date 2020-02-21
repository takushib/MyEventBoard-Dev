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
  if ($row[0] != -1) {
    $queryUser = 'SELECT email, first_name FROM User WHERE id = ?';
    $statement2 = $database->prepare($queryUser);
    $statement2->bind_param("i", $user_id);
    $statement2->execute();
    $res = $statement2->get_result();
    $user = $res->fetch_object();
    $format = "Hi %s,\nYou have successfully reserved a timeslot.\n";
    $headers = "From: MyEventBoard"
    . "\r\n" .
    "CC: louiesi@oregonstate.edu, liaoto@oregonstate.edu";
    $msg = sprintf($format, $user->first_name);
    mail($user->email,"Confirmation",$msg,$headers);
  }
  echo $row[0];


?>
