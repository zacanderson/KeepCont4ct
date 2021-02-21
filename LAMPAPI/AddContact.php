<?php
	$inData = getRequestInfo();
	
	// stores values from json file into variables
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$PhoneNumber = $inData["PhoneNumber"];
	$Email = $inData["Email"];
	$UserID = $inData["UserID"];
	$Notes = $inData["Notes"];

	$conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// inserts data from json file into database
		$sql = "INSERT into ContactInfo (FirstName,LastName,PhoneNumber,Email,UserID, Notes) VALUES (?,?,?,?,?,?)";
		$sql = $conn->prepare($sql);
		$sql->bind_param("ssssis", $FirstName, $LastName, $PhoneNumber, $Email, $UserID, $Notes);
		if($sql->execute() == FALSE)
		{
			returnWithError( $conn->error);
		}
		$conn->close();
	}
	
	$retvalue1 = '{"Successfully Added":"' . $FirstName . '"}';
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
