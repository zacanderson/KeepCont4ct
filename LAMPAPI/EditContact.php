<?php
    $inData = getRequestInfo();

    //in order to edit a contact
    //we need a UserID, and the record 
    //that we want to change - ID in 
    //from the ContactInfo table 

    //connect to database using user and password
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){

        returnWithError($conn->connect_error);

    }else{




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
    
    function returnWithInfo( $firstName, $lastName){
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>
