$(document).ready(function () {
    $('#sidebarCollapse, #sidebarCollapseIcon').on('click', function () {
        $('#sidebar').toggleClass('hidden');
    });
});

$(document).ready(function(){
	$('#tableSearch').on('keyup', function() {
	  var value = $(this).val().toLowerCase();
	  $('.tableBody tr').filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	  });
	});
  });

function minutesToFormat(totalMinutes) {
	totalMinutes = totalMinutes + "";
	
	if (totalMinutes.search("AM") != -1 || totalMinutes.search("PM") != -1) {
		return totalMinutes;
	}

	var timeString;
	var startHour = 7;
	var formatChange = 12 - startHour;

	var hours = startHour + Math.floor(totalMinutes / 60);
	var minutes = parseInt(totalMinutes) % 60;
	var format;

	if (Math.floor(totalMinutes / 60) >= formatChange) {
		if (hours != 12) hours = hours - 12;
		format = "PM";
	}
	else {
		format = "AM";
	}
	
	if (minutes === 0)
		timeString = hours + ":" + "00 "  + format;
	else
		timeString = hours + ":" + minutes + " " + format;

	return timeString;

}

function formatTime(time) {

	var temp = time.slice(11,13);
	var hour = parseInt(temp);

	if(hour > 12) {
		var newHour = hour - 12;
		var newTime = newHour.toString() + time.slice(13,16) + " PM";
		return newTime;
	}
	else if(hour === 12) {
		var newTime = hour.toString() + time.slice(13,16) + " PM";
		return newTime;
	}
	else {
		var newTime = hour.toString() + time.slice(13,16) + " AM";
		return newTime;
	}

}

function formatDate(date) {
	
	var dateYear = date.slice(0,4);
	
	var dateDay = date.slice(8, 10);
	dateDay = dateDay.replace(/^0+/, '') //truncate leading 0's
	
	var dateMonth = date.slice(5,7);
	dateMonth = dateMonth.replace(/^0+/, '')
	
	return dateMonth + "/" + dateDay + "/" + dateYear;

}

function formatTableDateTime(columnIndex) {

	var tableBody = document.getElementsByTagName('tbody')[0];

    for (row of tableBody.children) {
        var timeSlotString = row.children[columnIndex].innerText;
        var formattedDate = formatDate(timeSlotString); 
        var formattedTime = formatTime(timeSlotString); 
        row.children[columnIndex].innerText = formattedTime + ' on ' +  formattedDate;
	}
	
}