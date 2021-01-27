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
		// deletes data from json file in database
		$sql = "DELETE FROM ContactInfo WHERE FirstName = ? AND UserID = ?";
		$sql = $conn->prepare($sql);
		$sql->bind_param("si", $FirstName, $UserID);
		$sql->execute();
		$sql->store_result();
		$sql->bind_result($result);
		if( $result != TRUE )
		{
			returnWithError( $conn->error);
		}
		$conn->close();
	}
	
	// value to return in json file
	$retvalue1 = '{"Successfully Deleted":"' . $FirstName . '"}';
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
