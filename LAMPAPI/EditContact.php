<?php

    $inData = getRequestInfo();

    $id = $inData["ID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    //connect to database
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn->connect_error){
        returnWithError($conn->connect_error);

    }else{
        $sql = "UPDATE ContactInfo SET firstName = ? WHERE ID = ?";
        $sql = $conn->prepare($sql);
        $sql->bind_param("si", $firstName, $id);
        
        $sql->execute();

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