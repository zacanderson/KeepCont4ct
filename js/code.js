var urlBase = 'http://www.keepcont4ct.tech/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '", "first" : "' + firstName + '", "last" : "' + lastName + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userId = jsonObject.id;

		if (userId < 1) {
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
		// change redirect to landing page (still needs to be created)

		window.location.href = "http://www.keepcont4ct.tech/dashboard.html";

	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function register() {

	var login, password;


	firstName = document.getElementById("fname").value;
	lastName = document.getElementById("lname").value;
	login = document.getElementById("uname").value;
	password = document.getElementById("pass").value;


	if (firstName.length > 0 && lastName.length > 0 && login.length > 0 && password.length > 0) {

		var hash = md5(password);
		var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + hash + '"}';

		var url = urlBase + '/Register.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);


		var error = jsonObject.error;

		if (error.length == 0) {
			userId = jsonObject.id;
			saveCookie();

			window.location.href = "http://www.keepcont4ct.tech/dashboard.html";

		}



	}



}

function saveCookie() {
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName2").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.replace("http://www.keepcont4ct.tech/index.html");
}

function addContact() {

	document.getElementById("contactAddResult").innerHTML = "";



	firstName = document.getElementById("fname").value;
	lastName = document.getElementById("lname").value;
	phoneNumber = document.getElementById("phonenum").value;
	email = document.getElementById("email").value;

	var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '", "Email" : "' + email + '", "UserID" : ' + userId + '}';

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").innerHTML = "Contact(s) added";
			}
		};

		xhr.send(jsonPayload);

	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function modifyContact(ID) {

	//document.getElementById("contactAddResult").innerHTML = "";



	var name = document.getElementById(ID+"name").innerText;
	var phoneNumber = document.getElementById(ID+"number").innerText;
	var email = document.getElementById(ID+"email").innerText;

	var fullName = name.split(" ");
	var firstName = fullName[0];
	var lastName = fullName[1];


	var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '", "Email" : "' + email + '", "UserID" : ' + userId + ', "ID" : ' + ID + '}';

	var url = urlBase + '/EditContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				closePopUp(ID);
				searchContacts();
				
			}
		};

		xhr.send(jsonPayload);

	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function deleteContact(contactId) {

	

	var jsonPayload = '{"ID" : "' + contactId + '","UserID" : ' + userId + '}';

	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.onreadystatechange = function ()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				window.location.replace("http://www.keepcont4ct.tech/search2.html");
			}
		};
		xhr.send(jsonPayload);
		

	}
	catch (err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function parseName(input) {
	var fullName = input || "";
	var result = {};

	if (fullName.length > 0) {
		var nameTokens = fullName.match(/[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g) || [];

		if (nameTokens.length > 3) {
			result.name = nameTokens.slice(0, 2).join(' ');
		} else {
			result.name = nameTokens.slice(0, 1).join(' ');
		}

		if (nameTokens.length > 2) {
			result.lastName = nameTokens.slice(-2, -1).join(' ');
			result.secondLastName = nameTokens.slice(-1).join(' ');
		} else {
			result.lastName = nameTokens.slice(-1).join(' ');
			result.secondLastName = "";
		}
	}

	return result;
}


function searchContacts() {






	var srch = document.getElementById("inpt_search").value;
	srch = parseName(srch);
	//	document.getElementById("contactSearchResult").innerHTML = "";





	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","UserID" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	/*
	if (srch === "") {
		const contactInfo = document.querySelector('#contactInfo');
		const myModal = document.querySelector('#myModal');

		if(contactInfo.firstChild) {
			contactInfo.removeChild(contactInfo.firstChild);
		}		

		while (myModal.firstChild) {	
			myModal.removeChild(myModal.firstChild);

		}

	}
	*/

	//else {
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					//document.getElementById("contactSearchResult").innerHTML = "Contact(s) retrieved";
					var jsonObject = JSON.parse(xhr.responseText);

					const contactInfo = document.querySelector('#contactInfo');
					const myModal = document.querySelector('#myModal');

					if(contactInfo.firstChild) {
						contactInfo.removeChild(contactInfo.firstChild);
					}





					while (myModal.firstChild) {
						
						myModal.removeChild(myModal.firstChild);
					}




					var cB = "<table class=\"table table-bordered table-dark table-hover\"><thead><tr><th></th><th>First Name</th><th>Last Name</th><th>Number</th></tr></thead><tbody>";


					for (var i = 0; i < jsonObject.results.length; i++) {
						contactList += jsonObject.results[i];

						var res = jsonObject.results[i].split("|");
						var fName = res[0];
						var lName = res[1];
						var pNum = res[2];
						var email = res[3];
						var ID = res[4];

						const elem = document.createElement('div');

						document.getElementById("contactInfo").innerHTML = cB;

						cB = cB + "<tr id=\""+res[4] + "-"+ fName+"\" onclick=\"showPopUp("+res[4]+")\"><th scope=\"row\"></th><td>"
						+fName+"</td><td>"+lName+"</td><td>"+pNum+"</td></tr>";


						const popUpBox = document.createElement('div');
						popUpBox.className = "modal-content2";
						popUpBox.id = res[4];

						document.getElementById("myModal").appendChild(popUpBox);

						document.getElementById(""+res[4]).innerHTML = "<span class=\"close\" onclick=\"closePopUp("+res[4]
						+")\">&times;</span><div style=\"width: 90%; margin-right: 0%;\"><h1  id=\""+ID+"name\">"+fName+" "+lName+"</h1></div><br><h2>number: </h2><h2  id=\""+ID+"number\">"
						+pNum+"</h2><h2>email: </h2><h2  id=\""+ID+"email\">"+email+"</h2><h3>note: </h3><button type=\"button\" value=\"Delete\" class=\"deleteButton\""+
						" id=\""+ID+"delete\" onclick=\"deleteContact("+ID+");\">Delete</button><br><button type=\"button\" value=\"Modify\" class=\"modifyButton\" id=\""+ID+"modify\" onclick=\"initialModify("+ID+");\""+
						">Modify</button><button type=\"button\" value=\"Save\" class =\"saveButton\" id=\""+ID+"save\" onclick=\"modifyContact("+ID+")\" >Save</button>"+
						"<button type=\"button\" value=\"Register\" class =\"exitButton\" id=\""+ID+"exit\" onclick=\"closePopUp("+res[4]+")\" >Exit</button>"

					}

					document.getElementById("contactInfo").innerHTML = cB + "</tbody></table>";
				}
			};


			xhr.send(jsonPayload);
		}
		catch (err) {
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	//}
}

function initialSearch() {

	var srch = document.getElementById("searchText").value;

	window.location.href = "http://www.keepcont4ct.tech/search2.html?" + srch;

}


function initialModify(ID) {

	document.getElementById(ID+"name").contentEditable = "true";
	document.getElementById(ID+"number").contentEditable = "true";
	document.getElementById(ID+"email").contentEditable = "true";

	document.getElementById(ID+"save").style.display = "inline-block";
	document.getElementById(ID+"exit").style.display = "inline-block";

	document.getElementById(ID+"modify").style.display = "none";
	document.getElementById(ID+"delete").style.display = "none";

	



	//name.style.contentEditable = "true";
	///num.style.contentEditable = "true";
	//email.style.contentEditable = "true";



	//window.location.href = "http://www.keepcont4ct.tech/search2.html?" + srch;

}

function fillSearchBar() {


	const queryString = location.search.substring(1);

	if(queryString == "undefined")
	{
		queryString = "";
	}
	var qS = queryString.split("%20");
	document.getElementById("inpt_search").value = "" + qS[0] + " " + qS[1];
	searchContacts();
}

function showPopUp(idNum) {

	var modal = document.getElementById("myModal");
	var modal2 = document.getElementById(""+idNum);

	//var modalInfo = document.getElementById("modal-content");

	modal2.style.display = "block";

	modal.style.display = "block";
	//modalInfo.style.display = "block";

}

function closePopUp(ID) {

	var modal = document.getElementById("myModal");
	var modal2 = document.getElementById(""+ID);

	document.getElementById(ID+"name").contentEditable = "false";
	document.getElementById(ID+"number").contentEditable = "false";
	document.getElementById(ID+"email").contentEditable = "false";

	document.getElementById(ID+"save").style.display = "none";
	document.getElementById(ID+"exit").style.display = "none";

	document.getElementById(ID+"modify").style.display = "inline-block";
	document.getElementById(ID+"delete").style.display = "inline-block";

	modal2.style.display = "none";

	modal.style.display = "none";

}

function test() {
	var cB = "";
	for (var i =0; i < 2; i++)
{
	cB = cB + "<tr id=\""+"res[4]" + "-"+ "fName"+"\" onclick=\"showPopUp("+"res[4]"+")\"><th scope=\"row\"></th><td>"
	+"fName"+"</td><td>"+"lName"+"</td><td>"+"pNum"+"</td></tr>";

}

	document.getElementById("searchR").innerHTML = cB;

	mInfo = "<span class=\"close\" onclick=\"closePopUp()\">&times;</span><h1>"+fName+" "+lName+"</h1><br><h2>number: "+pNum+"</h2><h2>email: "+email+"</h2><h3>note: </h3>"
}

function test2() {
	document.getElementById("saveButton").style.display = "inline-block";
	document.getElementById("exitButton").style.display = "inline-block";

	document.getElementById("modifyButton").style.display = "none";
	document.getElementById("deleteButton").style.display = "none";


	var name = document.getElementById("t-name");
	var num = document.getElementById("t-num");
	var email = document.getElementById("t-email");


}

