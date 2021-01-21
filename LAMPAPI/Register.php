<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){
        returnWithError($conn->connect_error);

    }else{
        $sql = "SELECT Login FROM Users WHERE Login= '".$inData["login"]."'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0){
            $ret = "Username already exists";
            returnWithError($ret);

        }else{
            $sql = "INSERT INTO Users(firstName, lastName, Login, Password) VALUES ('".$inData["firstName"]."', '". $inData["lastName"] . "', .'"$inData["login"] . "', .'"$inData["password"]"'.)";
            $result = $conn->query($ret);

            

        }
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
    
    function returnWithInfo( $firstName, $lastName, $id ){
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>

