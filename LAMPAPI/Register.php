<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];

    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){
        returnWithError($conn->connect_error);

    }else{

        //$sql = "SELECT Login FROM Users WHERE Login= '".$inData["login"]."'";
        $sql = $conn->prepare("SELECT Login FROM Users WHERE Login=?");
        $sql->bind_param("s", $inData["login"]);
        $sql->execute();
        
        $result = $sql->get_result();

        if ($result->num_rows > 0){
            $ret = "Username already exists";
            returnWithError($ret);

        }else{
            $sql = "INSERT INTO Users(firstName, lastName, Login, Password) VALUES ('".$inData["firstName"]."', '". $inData["lastName"] . "', '" . $inData["login"] . "', '" . $inData["password"] . "')";
            $result = $conn->query($sql);

            returnWithInfo($firstName, $lastName);

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
    
    function returnWithInfo( $firstName, $lastName){
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>

