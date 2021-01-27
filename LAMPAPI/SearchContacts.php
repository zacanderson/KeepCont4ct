<?php
	$inData = getRequestInfo();
		
	$searchResults = "";
	$searchCount = 0;
	$search = $inData["search"];
	$UserID = $inData["UserID"];

	

	$conn = new mysqli("localhost", "NotTheBeast", "WeAdoreCOP4331", "KeepContact");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT firstName, lastName, phoneNumber, email FROM ContactInfo where firstName like ? and UserID = ?";
		$sql = $conn->prepare($sql);
		$search = '%' . $search . '%';
		$sql->bind_param("si", $search, $UserID);
		$sql->execute();
		$result = $sql->get_result();
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["firstName"] . ' ' . $row["lastName"] . '"';
			}
			returnWithInfo( $searchResults );
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}

	

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
