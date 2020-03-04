<?php

    function getUserKeyFromDB($userONID, $database) {

        $query = "SELECT id AS 'key' FROM User WHERE onid = ?";

        $statement = $database -> prepare($query);

        $statement -> bind_param('s', $userONID);
        $statement -> execute();

        $result = $statement -> get_result();
        $result_array = $result -> fetch_all(MYSQLI_ASSOC);
        $userKey = $result_array[0]['key'];

        $result -> free();

        return $userKey;

    } 

?>
