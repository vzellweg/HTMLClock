/*
 * Remove the alarm at the selected index.
 */
function deleteAlarm () {
   var alarmObject = Parse.Object.extend('Alarm');
   var query = new Parse.Query(alarmObject);
   var alarmNdx;
   var alarmDOM;
   var removeId;

   $('#selectable li').each(
      function (ndx, elt) {
         var self = $(elt);

         if (self.hasClass('ui-selected')) {
            alarmDOM = self;
            alarmNdx = ndx;
            query.equalTo("alarmName", self.find('.name').text());

         }
      });
   
   var userField = $('#user-id').text().trim();
   
   console.log('userField: ' + userField);
   if (!userField) {
      console.log('removing signed-off alarm');
      alarmDOM.detach();
      if ($('#selectable li').length < 1) {
         $('#no-alarms').show();
      }
      return;
   }
/* alarmObject.destroy({
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
                        alarmDOM.detach();
                        if ($('#selectable li').length < 1) {
                           $('#no-alarms').show();
                        }
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

/*
 * Removes the 'hide' class from the 'mask' nad 'popup' divs
*/
function showAlarmPopup () {
   $('#mask').removeClass('hide');
   $('#popup').removeClass('hide');
   //$('flexible input[type=button][value=Save Alarm]').click(ShowAlarmPopup);
}

function hideAlarmPopup () {
   $('#mask').addClass('hide');
   $('#popup').addClass('hide');
}

function insertAlarm (hours, mins, ampm, alarmName) {
   var baseAlarm = $('<li>').addClass('ui-widget-content');
   var newAlarm = $('<div>').addClass('flexable');

   if ($('#selectable li').length < 1) {
      $('#no-alarms').hide();
   }
   baseAlarm.append(newAlarm);

   newAlarm.append($('<div>').html(alarmName).addClass('name'));

   newAlarm.append($('<div>').html(hours + ':' + mins + ' ' + ampm).addClass('time')); 

   $('#selectable').append(baseAlarm);
}

function addAlarm () {
   var hours = $("#hours option:selected").text();

   var mins = $("#mins option:selected").text();

   var ampm  = $("#ampm option:selected").text();

   var alarmName = $("#alarmName").val();

   var time = hours + ':' + mins + ':' + ampm;
   var userField = $('#user-id').text();
   var userId = userField ? userField.split(' ')[1] : null;

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();

/*    alarmObject.save({foo: "bar"}).then(function(object) {
      alert("yay! it worked");
   });
*/   
   if (userId) {
      alarmObject.save({"time": time,"alarmName": alarmName, "createdBy": userId}, {
         success: function(object) {
            insertAlarm(hours, mins, ampm, alarmName);
            hideAlarmPopup();
         },
         error: function(error) {
            alert('error saving new object');
            return;
         }
       });
   } else {
      insertAlarm(hours, mins, ampm, alarmName);
      hideAlarmPopup();
   }
    
}

function getAllAlarms (userId) {
   Parse.initialize("rnjXHYtI61sJUWgVmpU04DW9YIzGS8jfOD6StWbz", "pV0BlDH2m6kSpDhTheYYEoSMRxZ4OoHoaUy55bva");
   var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);

    query.equalTo("createdBy", userId);

    query.find({
        success: function(results) {
            //remove any existing list items
            $('#selectable li').detach();

            

            for (var i = 0; i < results.length; i++) { 
               var attrs = results[i].attributes;
                var times = attrs.time.split(':');

                insertAlarm(times[0], times[1], times[2], attrs.alarmName);
            }
            if (results.length === 0)
            {
               $('#no-alarms').show();
            }
        }
    });

}
