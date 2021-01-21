<?php
    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new myqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){
        returnWithError($conn->connect_error);

    }else{
        

    }



    function returnWithError( $err ){
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        
	}


?>