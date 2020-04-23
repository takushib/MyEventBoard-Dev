<?php
  function emailUsers($users, $siteURL) {
    foreach($users as $user) {
      // format email message
      $format = "Hi %s,\n\nThe host for %s has removed the slot that you reserved.\n\nPlease sign up for an available slot by clicking the link below:\n\n%s\n";
      $headers = "From: MyEventBoard" . "\r\n";
      $msg = sprintf($format, $user['first_name'], $user['event_name'], $siteURL);
      mail($user['email'], "Time Slot Removal Notification", $msg, $headers);
    }

  }
?>
