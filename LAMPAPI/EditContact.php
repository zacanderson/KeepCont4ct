<?php

    $inData = getRequestInfo();

    $id = $inData["ID"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $email = $inData["Email"];
    $phoneNumber = $inData["PhoneNumber"];
    $userID = $inData["UserID"];
    $notes = $inData["Notes"]

    //connect to database
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn->connect_error){
        returnWithError($conn->connect_error);

    }else{
        $sql = "UPDATE ContactInfo SET FirstName = ?, LastName = ?, Email= ?, PhoneNumber= ?, Notes = ? WHERE ID = ? AND UserID = ?";
        $sql = $conn->prepare($sql);
        $sql->bind_param("sssssii", $firstName, $lastName, $email, $phoneNumber, $notes, $id, $userID);
        
        $sql->execute();

        if($sql->affected_rows > 0){
            returnWithInfo($firstName, $lastName, $id);

        }else{
            returnWithError("You do not have permission to change that");

        }

        

    }




    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj ){
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithInfo( $firstName, $lastName, $id ){
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithError( $err ){
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        
    }
?>