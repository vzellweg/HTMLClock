$(document).ready(function()
	{
		getTime();
		getTemp();
	});

function getTime() {
   var d = new Date();
   document.getElementById("clock").innerHTML = d.toLocaleTimeString();

   var timeInterval = setTimeout(function(){getTime()},500);
};

function getTemp() {
	$.getJSON('https://api.forecast.io/forecast/3dad6326f2e1b16e70c1ebb234eb5022/35.300399,-120.662362?callback=?',
		tempSuccess
	)
;}

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