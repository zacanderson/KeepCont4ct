<?php
	$inData = getRequestInfo();
	
	// stores values from json file into variables
	$ID = $inData["ID"];
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
		$sql = "DELETE FROM ContactInfo WHERE ID = ? AND UserID = ?";
		$sql = $conn->prepare($sql);
		$sql->bind_param("si", $ID, $UserID);
		if($sql->execute() == FALSE)
		{
			returnWithError( $conn->error);
		}
		$conn->close();
	}
	
	// value to return in json file
	$retvalue1 = '{"Successfully Deleted":"' . $ID . '"}';
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
