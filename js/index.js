
var Alarm = function() {
	this.alarms = [];
	this.timeout = 0;
}
/*
 * Remove the alarm at the selected index.
 */
Alarm.prototype.deleteAlarm = function () {
	var alarmObject = Parse.Object.extend('Alarm');
	var query = new Parse.Query(alarmObject);
	var alarmNdx;
	var alarmDOM;
	var removeId;

	$('#selectable li').each(
		function (ndx, elt) {
			var self = $(elt);

			if (self.hasClass('ui-selected')) {
				alert('ndx ' + ndx + ', deleting alarm ' + self.find('.name').text());
				alarmDOM = self;
				alarmNdx = ndx;
				query.equalTo("alarmName", self.find('.name').text());

			}
		});

	console.log('alarms array' + this.alarms);
/*	alarmObject.destroy({
				success: function(myObject) {
					alert('The object was deleted from the Parse Cloud.');
					alarmDOM.detach();
				},
				error: function(myObject, error) {
					alert('The delete failed.' + '\n' + error);
					// error is a Parse.Error with an error code and message.
				}	
			});	
*/	
	query.first({
			success: function(object) {
				var removeId = object.id;
				query.get(removeId, {
					success: function (myObject) {
						myObject.destroy({
							success: function(myObject) {
								alert('The object was deleted from the Parse Cloud.');
								alarmDOM.detach();
							},
							error: function(myObject, error) {
								alert('The delete failed.' + '\n' + error);
								// error is a Parse.Error with an error code and message.
							}	
						});	
					},
					error: function(myObject, error) {
						console.log('The get failed.' + '\n' + error);
						// error is a Parse.Error with an error code and message.
					}	
				});
			},
			error: function(myObject, error) {
				console.log('The query failed.' + '\n' + error);
				// error is a Parse.Error with an error code and message.
			}
		});
	
}

Alarm.prototype.configure = function () {
		this.getTime();
		this.getLocation();
		this.getAllAlarms(this);
		$('#addAlarm').button().click(this.showAlarmPopup);
		$('#deleteAlarm').button().click(this.deleteAlarm);
		$('#hideAlarm').button().click(this.hideAlarmPopup);
		$('#saveAlarm').button().click(this.addAlarm);	
}


Alarm.prototype.getTime = function () {
   var d = new Date();
   var $this = this;
   document.getElementById("clock").innerHTML = d.toLocaleTimeString();

   this.timeout = setTimeout(function(){$this.getTime()},500);
}
 	
Alarm.prototype.getTemp = function (latitude, longitude) {
	// Set the default geolocation to building 14 
	latitude = typeof latitude !== 'undefined' ? latitude : '35.300399';
    longitude = typeof longitude !== 'undefined' ? longitude : '-120.662362';
    var getStr = 'https://api.forecast.io/forecast/3dad6326f2e1b16e70c1ebb234eb5022/' + latitude + ',' + longitude + '?callback=?';
	
	console.log('getStr: ' + getStr);
	$.getJSON(getStr, this.tempSucces);
}

/*
 * Calculate background color based on temperature.
 */
Alarm.prototype.tempSuccess = function (data) {
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

Alarm.prototype.getLocation = function () {
	var $this = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, 
    		function (error) {
    			$this.getTemp();
    		});
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

Alarm.prototype.showPosition = function (position) {
    this.getTemp(position.coords.latitude, position.coords.longitude);
}



/*
 * Removes the 'hide' class from the 'mask' nad 'popup' divs
*/
Alarm.prototype.showAlarmPopup = function () {
	$('#mask').removeClass('hide');
	$('#popup').removeClass('hide');
	//$('flexible input[type=button][value=Save Alarm]').click(ShowAlarmPopup);
}

Alarm.prototype.hideAlarmPopup = function () {
	$('#mask').addClass('hide');
	$('#popup').addClass('hide');
}

Alarm.prototype.insertAlarm = function (hours, mins, ampm, alarmName) {
	var baseAlarm = $('<li>').addClass('ui-widget-content');
	var newAlarm = $('<div>').addClass('flexable');

	baseAlarm.append(newAlarm);

	newAlarm.append($('<div>').html(alarmName).addClass('name'));

	newAlarm.append($('<div>').html(hours + ':' + mins + ' ' + ampm).addClass('time')); 

	$('#selectable').append(baseAlarm);
}

Alarm.prototype.addAlarm = function () {
	var hours = $("#hours option:selected").text();

	var mins = $("#mins option:selected").text();

	var ampm  = $("#ampm option:selected").text();

	var alarmName = $("#alarmName").val();

   var time = hours + ':' + mins + ':' + ampm;
	
	var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();
   var self = this;
/*  	alarmObject.save({foo: "bar"}).then(function(object) {
  		alert("yay! it worked");
	});
*/   
    alarmObject.save({"time": time,"alarmName": alarmName}, {
      success: function(object) {
    	self.insertAlarm(hours, mins, ampm, alarmName);
    	self.hideAlarmPopup();
      },
      error: function(error) {
      	alert('error saving new object');
      	return;
      }
    });

    
}

Alarm.prototype.getAllAlarms = function (self) {
	Parse.initialize("rnjXHYtI61sJUWgVmpU04DW9YIzGS8jfOD6StWbz", "pV0BlDH2m6kSpDhTheYYEoSMRxZ4OoHoaUy55bva");
	var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    var $this = self;


    query.find({
        success: function(results) {

            $('#selectable').selectable();
            for (var i = 0; i < results.length; i++) { 
            	var attrs = results[i].attributes;
                var times = attrs.time.split(':');
               	$this.alarms.push(results[i].id);

                $this.insertAlarm(times[0], times[1], times[2], attrs.alarmName);
            }
        }
    });

}

//Alarm();