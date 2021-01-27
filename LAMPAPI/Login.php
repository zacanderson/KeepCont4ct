<?php
    $inData = getRequestInfo();

    $id = 0;
    $firstName = "";
    $lastName = "";

    //connect to database using user and password
    $conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");

    if($conn -> connect_error){
        returnWithError($conn->connect_error);

    }else{
        //gets data from the inData json payload
        //$sql = "SELECT ID,firstName,lastName FROM Users where Login='" . $inData["login"] . "' and Password='" . $inData["password"] . "'";

        $sql = $conn->prepare("SELECT ID, firstName, lastName FROM Users where Login= ? and Password=?");
        $sql->bind_param("ss", $inData["login"], $inData["password"]);
        $sql->execute();

        //gets results from database
        $result = $sql->get_result();


        //if there are records we can pull them
        if ($result->num_rows > 0){
			    $row = $result->fetch_assoc();
			    $firstName = $row["firstName"];
			    $lastName = $row["lastName"];
          $id = $row["ID"];
          
          //should set DateLastLoggedIn to current time
          $sql = "UPDATE Users SET DateLastLoggedIn = CURRENT_TIMESTAMP WHERE ID =" . $id ;
          $result = $conn->query($sql);
            
            
			    returnWithInfo($firstName, $lastName, $id );
        
        //otherwise there is no user with the login and password
        }else{
          returnWithError( "No Records Found" );
        }
        
		$conn->close();

    }


    //helper functions
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