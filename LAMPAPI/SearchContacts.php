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
		//Search by first name partial completion
		$sql = "SELECT firstName, lastName, phoneNumber, email, ID, notes FROM ContactInfo where CONCAT(firstName, ' ', lastName) like ? and UserID = ?";
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
				$searchResults .= '"' . $row["firstName"] . '|' . $row["lastName"] . '|' . $row["phoneNumber"] . '|' . $row["email"] . '|' . $row["notes"] . '|' . $row["ID"] . '"';
			}
			// return json file with array where each index is a contact.
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
