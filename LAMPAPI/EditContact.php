<?php

    $inData = getRequestInfo();

    $id = $inData["id"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];
    $userID = $inData["userID"];

    //connect to database
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn->connect_error){
        returnWithError($conn->connect_error);

    }else{
        $sql = "UPDATE ContactInfo SET firstName = ?, lastName = ?, email= ?, phoneNumber= ? WHERE ID = ? AND UserID = ?";
        $sql = $conn->prepare($sql);
        $sql->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $id, $userID);
        
        $sql->execute();

        $result = $sql->get_result();
        if($result->num_rows > 0){
            returnWithInfo($firstName, $lastName, $id);
        }else{
            returnWithError("You do not have permission to change that contact");

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