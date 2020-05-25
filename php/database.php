<?php

// include functions for generating hashes

require_once 'php/hash.php';

// definition of class for custom interface of MySQLi database

class DatabaseInterface {

    private $database;


    function __construct($host, $userName, $password, $databaseName) {
        $this -> database = new mysqli($host, $userName, $password, $databaseName);
    }

    public function getError() {
        return ($this -> database -> connect_error);
    }

    
    public function getUserByONID($userONID) {

        $query = "
            
            SELECT id, onid, email, last_name, first_name 
            FROM meb_user 
            WHERE onid = ?
            
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("s", $userONID);
        $statement -> execute();

        $result = $statement -> get_result();


        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $userData = $resultArray[0];
        }
        else {
            $userData = null;
        }


        $statement -> close();
        $result -> free();

        return $userData;

    }

    public function getUserKey($userONID) {

        $userData = $this -> getUserByONID($userONID);

        if ($userData) {
            return $userData["id"];
        }
        else {
            return -1;
        }

    }

    public function addUser($userONID, $email, $firstName, $lastName) {

        // check if user is in database
        
        $userData = $this -> getUserByONID($userONID);

        // if user is not in database, add user to database

        if ($userData == null) {

            $query = "
                
                INSERT INTO meb_user(onid, email, last_name, first_name) 
                VALUES (?, ?, ?, ?)
            
            ";

            $statement = $this -> database -> prepare($query);
            
            $statement -> bind_param("ssss", $userONID, $email, $lastName, $firstName);
            $statement -> execute();

            $result = $statement -> affected_rows;

            $statement -> close();

            return $result;

        }

    }


    public function getTimeSlot($slotKey) {
        
        $query = "
        
            SELECT 
            id, hash, start_time, end_time, duration, 
            slot_capacity, spaces_available, is_full, fk_event_id

            FROM meb_timeslot
            WHERE hash = ?

        ";

        $statement = $this -> database -> prepare($query);
        $statement -> bind_param("s", $slotKey);
        $statement -> execute();

        $result = $statement -> get_result();
        
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $slotData = $resultArray[0];
        }
        else {
            $slotData = null;
        }

        $statement -> close();
        $result -> free();

        return $slotData;
    
    } 

    private function addTimeSlots($slotData, $eventID) {

        $query = "

            INSERT INTO 
            meb_timeslot(hash, start_time, end_time, duration, slot_capacity, spaces_available, is_full, fk_event_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)

        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param(
			"sssiiiii", 
			$hash, $startDate, $endDate, $duration, $capacity, $spaces, $full, $eventID
        );
        
        
        $result = 0;        
        $full = 0;

        foreach($slotData["dates"] as $item){

			$startDate = $item["startDate"];
			$endDate = $item["endDate"];
			$duration = $slotData["duration"];
			$capacity = $slotData["capacity"];
			$spaces = $slotData["capacity"];

			$hash = createTimeSlotHash($startDate, $endDate, $eventID);

            $statement -> execute();
            
            $result += $statement -> affected_rows;

        }
        
        $statement -> close();

        return $result;

    }


    public function getUserEvents($userONID) {

        $query = "
        
            SELECT
            meb_event.hash AS 'Event Key',
            meb_event.name AS 'Event Name',
            CONCAT(CAST(meb_event.open_slots AS CHAR), ' / ', CAST(meb_event.capacity AS CHAR)) AS 'Slots'

            FROM meb_event
            INNER JOIN meb_user 
            ON meb_event.fk_event_creator = meb_user.id
            WHERE meb_user.onid = ?
            ORDER BY meb_event.name
        
        ";

        $statement = $this -> database -> prepare($query);
        $statement -> bind_param("s", $userONID);
        $statement -> execute();

        $result = $statement -> get_result();

        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
        }
        else {
            $resultArray = null;
        }

        $statement -> close();
        $result -> free();

        return $resultArray;

    }

    public function getEventBySlotKey($slotKey) {

        $query = "
            
            SELECT 
            meb_event.id, meb_event.hash, name, description, location, onid AS 'creator',
            capacity, open_slots, is_anon AS 'anonymous', enable_upload AS 'upload'

            FROM meb_event
            INNER JOIN meb_user 
                ON meb_event.fk_event_creator = meb_user.id 
            INNER JOIN meb_timeslot
                ON meb_event.id = meb_timeslot.fk_event_id
            WHERE meb_timeslot.hash = ?
        
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("s", $slotKey);
        $statement -> execute();

        $result = $statement -> get_result();

        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $eventData = $resultArray[0];
        }
        else {
            $eventData = null;
        }

        $statement -> close();
        $result -> free();

        return $eventData;

    }

    public function getEvent($eventKey) {

        $query = "
            
            SELECT 
            meb_event.id, hash, name, description, location, onid AS 'creator',
            capacity, open_slots, is_anon AS 'anonymous', enable_upload AS 'upload'

            FROM meb_event
            INNER JOIN meb_user ON meb_event.fk_event_creator = meb_user.id 
            WHERE hash = ?
        
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("s", $eventKey);
        $statement -> execute();

        $result = $statement -> get_result();

        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $eventData = $resultArray[0];
        }
        else {
            $eventData = null;
        }

        $statement -> close();
        $result -> free();

        return $eventData;

    }

    public function addEvent($eventData, $slotData) {

        $name = $eventData["name"];
        $description = $eventData["description"];
        $creator = $eventData["creator"];
        $location = $eventData["location"];
        $capacity = $eventData["capacity"];
        $openSlots = $eventData["capacity"];
        $anonymous = $eventData["anonymous"];
        $upload = $eventData["upload"];

        $hash = createEventHash($name, $description, $creator, $location);


        $query = "

            INSERT INTO meb_event(hash, name, description, fk_event_creator, location, capacity, open_slots, is_anon, enable_upload) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param(
			"sssisiiii", 
			$hash, $name, $description, $creator, $location, $capacity, $openSlots, $anonymous, $upload
        );

        $statement -> execute();

        $newEventID = $this -> database -> insert_id;
        $this -> addTimeSlots($slotData, $newEventID);

        $result = $statement -> affected_rows;


        $statement -> close();

        return $result;

    }


    public function getDashboardData($userONID) {

        $query = "

            SELECT
            U.onid AS 'user',
            E.name AS 'event_name',
            E.location AS 'event_location',
            E.description AS 'event_description',
            T.start_time AS 'start_time',
            T.end_time as 'end_time',
            T.duration as 'slot_duration',
            T.spaces_available as 'slots_remaining',
            U1.first_name as 'ec_first_name',
            U1.last_name as 'ec_last_name'

            FROM meb_booking
            INNER JOIN meb_user U 
                ON meb_booking.fk_user_id = U.id
            INNER JOIN meb_timeslot T 
                ON meb_booking.fk_timeslot_id = T.id
            INNER JOIN meb_event E 
                ON T.fk_event_id = E.id
            INNER JOIN meb_user U1 
                ON E.fk_event_creator = U1.id

            WHERE U.onid = ? 
            ORDER BY T.start_time

        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("s", $userONID);
        $statement -> execute();
    
        $result = $statement -> get_result();

        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
        }
        else {
            $resultArray = null;
        }

        $statement -> close();
        $result -> free();

        return $resultArray;

    }

    public function getRegistrationData($eventKey, $userONID) {

        $query = "

            SELECT 
            T.hash, T.start_time, T.duration, 
            T.slot_capacity, T.spaces_available, T.is_full,
            E.description, E.location, 
            IF(U.onid = ?, TRUE, FALSE)
            
            FROM meb_timeslot T
            INNER JOIN meb_event E 
                ON T.fk_event_id = E.id
            LEFT JOIN meb_booking B
                ON T.id = B.fk_timeslot_id
            LEFT JOIN meb_user U 
                ON B.fk_user_id = U.id
            WHERE E.hash = ?

        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("ss", $userONID, $eventKey);
        $statement -> execute();

        $result = $statement -> get_result();
       
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
        }
        else {
            $resultArray = null;
        }

        $statement -> close();
        $result -> free();

        return $resultArray;

    }


    public function getReservationData($userONID) {

        $query = "

            SELECT
            t2.name AS 'Event',
            t1.start_time AS 'Start Time',
            t2.location AS 'Location',
            t2.hash AS 'Event Key',
            t1.hash AS 'Time Slot Key'

            FROM meb_booking AS t0
            INNER JOIN meb_timeslot AS t1
                ON t0.fk_timeslot_id = t1.id
            INNER JOIN meb_event AS t2
                ON t1.fk_event_id = t2.id
            INNER JOIN meb_user AS t3
                ON t0.fk_user_id = t3.id
            INNER JOIN meb_user AS t4
                ON t2.fk_event_creator = t4.id
                
            WHERE t3.onid = ?
            ORDER BY t1.start_time

        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("s", $userONID);
        $statement -> execute();

        $result = $statement -> get_result();
       
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
        }
        else {
            $resultArray = null;
        }

        $statement -> close();
        $result -> free();

        return $resultArray;

    }

    public function getReservationDetails($slotKey, $userONID) {

        $query = "

            SELECT
            t3.hash, t3.name, t3.location, t3.description, t3.enable_upload AS 'upload',
            CONCAT(t4.first_name, ' ', t4.last_name) AS 'creator',
            t1.start_time, t1.end_time, t5.path AS 'file'

            FROM meb_booking AS t0
            INNER JOIN meb_timeslot AS t1
                ON t0.fk_timeslot_id = t1.id
            INNER JOIN meb_user AS t2
                ON t0.fk_user_id = t2.id
            INNER JOIN meb_event AS t3
                ON t1.fk_event_id = t3.id
            INNER JOIN meb_user AS t4
                ON t3.fk_event_creator = t4.id 
            LEFT JOIN meb_files AS t5
                ON t0.id = t5.fk_booking_id

            WHERE t1.hash = ? AND t2.onid = ?

        ";
        
        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("ss", $slotKey, $userONID);
        $statement -> execute();

        $result = $statement -> get_result();
       
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $reservationDetails = $resultArray[0];
        }
        else {
            $reservationDetails = null;
        }

        $statement -> close();
        $result -> free();

        return $reservationDetails;

    }

    public function getUserBooking($slotKey, $userONID) {

        $query = "

            SELECT 
            b.id, fk_timeslot_id AS 'slotID', fk_user_id AS 'userID'
            
            FROM meb_booking AS b
            INNER JOIN meb_timeslot AS t
            ON t.id = b.fk_timeslot_id
            INNER JOIN meb_user AS u
            ON u.id = b.fk_user_id

            WHERE t.hash = ? AND u.onid = ?

        ";

        $statement = $this -> database -> prepare($query);
        
        $statement -> bind_param("ss", $slotKey, $userONID);
        $statement -> execute();

        $result = $statement -> get_result();
        
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $bookingData = $resultArray[0];
        }
        else {
            $bookingData = null;
        }

        $statement -> close();    
        $result -> free();

        return $bookingData;
        
    }


    public function reserveTimeSlot($slotID, $userID) {

        $query = "CALL meb_reserve_slot(?, ?, @res1)";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("ii", $slotID, $userID);
        $statement -> execute();
        $statement -> close();


        $query = "SELECT @res1";
        $result = $this -> database -> query($query);
        
        if ($result) {
            $resultArray = $result -> fetch_all(MYSQLI_NUM);
            $errorCode = $resultArray[0];
        }
        else {
            $errorCode = -1;
        }

        $statement -> close();
        $result -> free();

        return $errorCode;

    }

    public function deleteReservation($slotKey, $userONID) {

        $query = "CALL meb_delete_reservation(?, ?, @res1)";
    
        $statement = $this -> database -> prepare($query);
        
        $statement -> bind_param("ss", $slotKey, $userONID);
        $statement -> execute();
    
        
        $query = "SELECT @res1";
        $result = $this -> database -> query($query);
    
        if ($result) {
            $resultArray = $result -> fetch_all(MYSQLI_NUM);
            $errorCode = $resultArray[0];
        }
        else {
            $errorCode = -1;
        }
    

        $statement -> close();
        $result -> free();
    
        return $errorCode;
    
    }


    public function replaceFilePath($filePath, $fileID) {

        $query = "
        
            UPDATE meb_files 
            SET path = ? WHERE id = ? 
        
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("si", $filePath, $fileID);
        $statement -> execute();

        $result = $statement -> affected_rows;

        $statement -> close();

        return $result;

    }

    public function getFile($bookingID) {

        $query = "
        
            SELECT id, path, fk_booking_id AS 'bookingID' 
            FROM meb_files 
            WHERE fk_booking_id = ?
            
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("i", $bookingID);
        $statement -> execute();

        $result = $statement -> get_result();
        
        if ($result -> num_rows > 0) {
            $resultArray = $result -> fetch_all(MYSQLI_ASSOC);
            $fileData = $resultArray[0];
        }
        else {
            $fileData = null;
        }

        $statement -> close();    
        $result -> free();

        return $fileData;

    }

    public function addFile($filePath, $bookingID) {

        // if there exists file associated with booking
        // replace path for that file

        $fileData = $this -> getFile($bookingID);

        if ($fileData) {
            $result = $this -> replaceFilePath($filePath, $fileData["id"]);
            return 1;
        }

        // add file path associated with booking

        $query = "

            INSERT INTO meb_files(path, fk_booking_id)
            VALUES (?, ?)
        
        ";

        $statement = $this -> database -> prepare($query);

        $statement -> bind_param("si", $filePath, $bookingID);
        $statement -> execute();

        $result = $statement -> affected_rows;

        $statement -> close();

        return $result;

    }

}


// information for connecting to database

$databaseDetails = fopen('text_file', 'r');

$host = trim(fgets($databaseDetails));
$userName = trim(fgets($databaseDetails));
$password = trim(fgets($databaseDetails));
$databaseName = trim(fgets($databaseDetails));

fclose($databaseDetails);


// create connection to database

$database = new DatabaseInterface($host, $userName, $password, $databaseName);

// check if that was successful
// application is completely dependent on database so dying is acceptable

if ($database -> getError()) {
    die('A connection to the database could not be established.');
}

?>