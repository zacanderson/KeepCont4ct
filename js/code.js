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

		window.location.replace("http://www.keepcont4ct.tech/dashboard.html?" + login);

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

			window.location.replace("http://www.keepcont4ct.tech/dashboard.html");

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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

	var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '", "PhoneNumber" : "' + phoneNumber + '", "Email" : "' + email + '", "UserID" : "' + userId + '"}';

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
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

function searchContacts() {




	

	var srch = document.getElementById("inpt_search").value;
//	document.getElementById("contactSearchResult").innerHTML = "";


	


	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//document.getElementById("contactSearchResult").innerHTML = "Contact(s) retrieved";
				var jsonObject = JSON.parse(xhr.responseText);

				const contactInfo = document.querySelector('#contactInfo');

				


				while (contactInfo.firstChild) {
					contactInfo.removeChild(contactInfo.firstChild);
				}







				for (var i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];


					const elem = document.createElement('div');
					elem.className = "contactsBox";
					const elemTextBox = document.createElement('div');
					elemTextBox.className = "cBox";

					const elemText = document.createTextNode(jsonObject.results[i]);
					elemTextBox.appendChild(elemText);
					elem.appendChild(elemTextBox);
					document.getElementById("contactInfo").appendChild(elem);

				//	if (i < jsonObject.results.length - 1) {
					//	contactList += "<br />\r\n";
					//}
				}

				//document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};


		xhr.send(jsonPayload);
	}
	catch (err) {
		//document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function searchTest() {

	var i;

	


	const contactInfo = document.querySelector('#contactInfo');

	var srch = document.getElementById("inpt_search").value;


	while (contactInfo.firstChild) {
		contactInfo.removeChild(contactInfo.firstChild);
	}


	for (i = 0; i < srch; i++) {
		const elem = document.createElement('div');
		elem.className = "contactsBox";
		const elemText = document.createElement('div');
		elemText.className = "cBox";

		elem.appendChild(elemText);
		document.getElementById("contactInfo").appendChild(elem);

	}


}

function getUsername () {

	
	const queryString = location.search.substring(1);
	const qString = document.createTextNode(queryString);
	document.getElementById("userN").appendChild(qString);



}

function initialSearch () {
	
	var srch = document.getElementById("searchText").value;
	
	window.location.replace("http://www.keepcont4ct.tech/index.html/search2.html?" + srch);

}

function fillSearchBar () {
	const queryString = location.search.substring(1);
	const qString = document.createTextNode(queryString);
	document.getElementById("inpt_search").value = "" + queryString;
	searchContacts();
}

