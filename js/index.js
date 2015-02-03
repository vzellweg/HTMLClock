$(document).ready(function()
	{
		getTime();
		getLocation();
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

/*
 * Removes the 'hide' class from the 'mask' nad 'popup' divs
*/
function showAlarmPopup() {
	$('#mask').removeClass('hide');
	$('#popup').removeClass('hide');
	//$('flexible input[type=button][value=Save Alarm]').click(ShowAlarmPopup);
}

function hideAlarmPopup() {
	$('#mask').addClass('hide');
	$('#popup').addClass('hide');
}

function insertAlarm(hours, mins, ampm, alarmName) {
	var newAlarm = $('<div>').addClass('flexable');

	newAlarm.append($('<div>').addClass('name').html(alarmName));

	newAlarm.append($('<div>').addClass('time').html(hours + ':' + mins + ' ' + ampm)); 

	$('#alarms').append(newAlarm);
}

function addAlarm() {
	var hours = $("#hours option:selected").text();

	var mins = $("#mins option:selected").text();

	var ampm  = $("#ampm option:selected").text();

	var alarmName = $("#alarmName").val();

	insertAlarm(hours, mins, ampm, alarmName);
	
	hideAlarmPopup();
}