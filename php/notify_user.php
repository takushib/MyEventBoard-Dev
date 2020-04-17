<?php
  function emailUsers($users, $siteURL) {
    foreach($users as $user) {
      // format email message
      $format = "Hi %s,\n\nThe host for %s has removed the slot that you reserved.\n\n
                Please sign up for an available slot by clicking the link below\n\n
                %s";
      $headers = "From: MyEventBoard" . "\r\n";
      //$msg = sprintf($format, )
    }

  }
?>
