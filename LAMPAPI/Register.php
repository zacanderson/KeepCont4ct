<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn->connect_error){
        returnWithError($conn->connect_error);

    }else{
        $sql = "SELECT Login FROM Users WHERE Login= '". $inData["login"]"'";
        $result = $conn->query($sql);

        if($result->num_rows > 0){
            returnWithError("Username already exists");

        }
    }


    function sendResultInfoAsJson( $obj ){
		header('Content-type: application/json');
	    echo $obj;
    }


    function returnWithError( $err ){
	    $retValue = '"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        
	}



?>

