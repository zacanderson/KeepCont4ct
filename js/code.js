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

function deleteContact(userId) {

	document.getElementById("contactDeleteResult").innerHTML = "";
	firstName = document.getElementById("fname").value;
	lastName = document.getElementById("lname").value;

	var jsonPayload = '{"FirstName" : "' + firstName + '", "LastName" : "' + lastName + '","UserID" : ' + userId + '}';

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
				document.getElementById("contactDeleteResult").innerHTML = "Contact(s) removed";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}



function searchContacts() {






	var srch = document.getElementById("inpt_search").value;
	//	document.getElementById("contactSearchResult").innerHTML = "";





	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","UserID" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	if (srch === "") {
		const contactInfo = document.getElementsByTagName('table');
		const myModal = document.querySelector('#myModal');

		while (contactInfo.firstChild) {
			contactInfo.removeChild(contactInfo.firstChild);
		

		}

		while (myModal.firstChild) {	
			myModal.removeChild(myModal.firstChild);

		}

	}
	else {
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					//document.getElementById("contactSearchResult").innerHTML = "Contact(s) retrieved";
					var jsonObject = JSON.parse(xhr.responseText);

					const contactInfo = getElementsByTagName('table');
					const myModal = document.querySelector('#myModal');





					while (contactInfo.firstChild) {
						contactInfo.removeChild(contactInfo.firstChild);
						myModal.removeChild(myModal.firstChild);
					}




					var cB = "<thead><tr><th></th><th>First Name</th><th>Last Name</th><th>Email</th></tr></thead><tbody>";


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

						//cB = cB + "<div class=\"contactsBox\" id=\""
						//+res[4] + "-"+ fName+"\" onclick=\"showPopUp("+res[4]+")\">"+
						//"<div class=\"cBox\">"+ res[0]+" "+res[1]+"</div><div class=\"cBox\" >"+res[2]+"</div>"+"</div>";




						cB = cB + "<tr id=\""+res[4] + "-"+ fName+"\" onclick=\"showPopUp("+res[4]+")\"><th scope=\"row\"></th><td>"
						+fName+"</td><td>"+lName+"</td><td>"+pNum+"</td></tr>";

						//elem.className = "contactsBox";
						//elem.id = res[4] + "-"+ fName;
						//elem.onclick = "showPopUp(105)";
						//elem.addEventListener("click",showPopUp(res[4], false) );
						//const elemTextBoxName = document.createElement('div');
						//elemTextBoxName.className = "cBox";
						//const elemTextBoxNum = document.createElement('div');
						//elemTextBoxNum.className = "cBox"; 


						//const elemTextName = document.createTextNode(res[0] + " " + res[1]);
						//const elemTextNum = document.createTextNode(res[2]);

						//elemTextBoxName.appendChild(elemTextName);
						//elemTextBoxNum.appendChild(elemTextNum);

						//elem.appendChild(elemTextBoxName);
						//elem.appendChild(elemTextBoxNum);

						const popUpBox = document.createElement('div');
						popUpBox.className = "modal-content";
						popUpBox.id = res[4];
						//popUpBox.appendChild(document.createTextNode(jsonObject.results[i]));



						document.getElementById("myModal").appendChild(popUpBox);


						//	if (i < jsonObject.results.length - 1) {
						//	contactList += "<br />\r\n";
						//}

						document.getElementById(""+res[4]).innerHTML = "<span class=\"close\" onclick=\"closePopUp("+res[4]
						+")\">&times;</span><h1>"+fName+" "+lName+"</h1><br><h2>number: "+pNum+"</h2><h2>email: "
						+email+"</h2><h3>note: </h3>"

					}

					document.getElementById("contactInfo").innerHTML = cB + "</tbody>";
				}
			};


			xhr.send(jsonPayload);
		}
		catch (err) {
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

function initialSearch() {

	var srch = document.getElementById("searchText").value;

	window.location.href = "http://www.keepcont4ct.tech/search2.html?" + srch;

}

function fillSearchBar() {
	const queryString = location.search.substring(1);
	const qString = document.createTextNode(queryString);
	document.getElementById("inpt_search").value = "" + queryString;
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

function closePopUp(idNum) {

	var modal = document.getElementById("myModal");
	var modal2 = document.getElementById(""+idNum);

	//var modalInfo = document.getElementById("modal-content");

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

