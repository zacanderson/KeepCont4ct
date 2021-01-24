<?php
    $inData = getRequestInfo();

    //in order to edit a contact
    //we need a UserID, and the record 
    //that we want to change - ID in 
    //from the ContactInfo table 

    $ID = $inData["ID"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];

    //connect to database using user and password
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){

        returnWithError($conn->connect_error);

    }else{

        $sql = $conn->prepare("UPDATE ContactInfo SET firstName= ?, lastName= ?, phoneNumber= ?, email= ? WHERE ID = ?");
        $sql = bind_param("ssisi", $firstName, $lastName, $phoneNumber, $email, $ID);
        $sql->execute();

        return returnWithInfo("Record updated");


    }

    function sendResultInfoAsJson( $obj ){
		header('Content-type: application/json');
	    echo $obj;
    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
        
	}

    function returnWithError( $err ){
	    $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        
    }
    
    function returnWithInfo($info){
		$retValue = '{"ID:" '" . $ID . "',"error":'" . $info . "'}';
		sendResultInfoAsJson( $retValue );
	}


?>
