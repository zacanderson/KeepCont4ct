<?php

    $inData = getRequestInfo();

    $firstName = "";
    $lastName = "";
    $login = "";
    $passwrod = "";

    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if(conn->connect_error){



    }else{



    }


    function sendResultInfoAsJson( $obj ){
		header('Content-type: application/json');
	    echo $obj;
    }


    function returnWithError( $err ){
	    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
        
	}



?>

