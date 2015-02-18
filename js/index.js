$(document).ready(function()
	{
		getTime();
		getLocation();
		$('#addAlarm').button().click(showAlarmPopup);
		$('#deleteAlarm').button().click(deleteAlarm);
		$('#hideAlarm').button().click(hideAlarmPopup);
		$('#saveAlarm').button().click(addAlarm);

	});

function getTime() {
   var d = new Date();
   document.getElementById("clock").innerHTML = d.toLocaleTimeString();

   var timeInterval = setTimeout(function(){getTime()},500);
}
 	
function getTemp(latitude, longitude) {
	// Set the default geolocation to building 14 
	latitude = typeof latitude !== 'undefined' ? latitude : 35.300399;
    longitude = typeof longitude !== 'undefined' ? longitude : -120.662362;
	$.getJSON('https://api.forecast.io/forecast/3dad6326f2e1b16e70c1ebb234eb5022/' + latitude + ',' + longitude + '?callback=?',
		tempSuccess
	);
}

/*
 * Calculate background color based on temperature.
 */
function tempSuccess(data) {
	console.log('Success!');
	console.log(data);
	var today = data.daily.data[0]; 
	var tempClass;

	if (today.temperatureMax < 60)
	{
		tempClass = 'cold';
	}
	else if (today.temperatureMax < 70) 
	{
		tempClass = 'chilly';
	}
	else if (today.temperatureMax < 80) 
	{
		tempClass = 'nice';
	}
	else if (today.temperatureMax < 90) 
	{
		tempClass = 'warm';
	}
	else
	{
		tempClass = 'hot';
	}


	$('body').removeClass();
	$('body').addClass(tempClass);
	
	$('#forecastLabel').text(today.summary);

	$('#forecastIcon').attr('src', 'img/' + today.icon + '.png');

	$('#forecastIcon').attr('alt', today.summary + ' icon');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showLocationError);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    getTemp(position.coords.latitude, position.coords.longitude);
}

/*
 * Handles any potential errors getting the user location.
 */
function showLocationError(error) {
	/*
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
    */
    getTemp();
}

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
  	console.log("login Success! Result: " + JSON.stringify(authResult));
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    $('#gSignInWrapper').toggleClass('hide');
    $('#selectable').toggleClass('hide');
    getAllAlarms();
		
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}