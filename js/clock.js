$(document).ready(getTime);

function getTime() {
   var d = new Date();
   document.getElementById("clock").innerHTML = d.toLocaleTimeString();

   var timeInterval = setTimeout(function(){getTime()},500);
};