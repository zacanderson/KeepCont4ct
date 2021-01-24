<?php
	$inData = getRequestInfo();
	
	// stores values from json file into variables
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// deletes data from json file into database
		$sql = "DELETE FROM ContactInfo where firstName = ''" . $FirstName . "' AND userID = " . $userID . "'";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error);
		}
		$conn->close();
	}
	
	$retvalue1 = '{"Successfully Deleted":"' . $FirstName . '","' . $LastName . '"}';
	sendResultInfoAsJson( $retvalue1 );
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
