const monthEnum = {
	January: '1',
	February: '2',
	March: '3',
	April: '4',
	May: '5',
	June: '6',
	July: '7',
	August: '8',
	September: '9',
	October: '10',
	November: '11',
	December: '12'
}



$(function () {
	$("#datepicker2").datepicker({
		startDate: new Date(),
		multidate: false,
		format: "mm/dd/yyyy",
		language: 'en'
	});
});


$(document).ready(function () {

	timeSlotObjects = createTimeSlotObjects();
	document.getElementById('timeSlots').remove();

	highlightCalendar();

});


// Source: https://jsfiddle.net/christianklemp_imt/b20paum2/
$(document).ready(function () {

	$('#datepicker2').datepicker().on('changeDate', function (e) {

		//var popup = document.getElementById("myModal");
		//popup.style.display = "block";
		$('.modal-body h2').text(e.format());
		createFields();

	});

	document.getElementById('datepicker2').addEventListener('click', highlightCalendar);

});


function createFields() {

	$('.removeOnClear').remove(); //Clear all cells

	var selectedDuration = "15 Minutes";
	var startTime = 0;
	var endTime = 120;
	
	var startTime2 = 180;
	var endTime2 = 300;

	switch (selectedDuration) {

		case "15 Minutes":
			var minutesIncrement = 15;
			break;

		case "30 Minutes":
			var minutesIncrement = 30;
			break;

		case "1 Hour":
			var minutesIncrement = 60;
			break;
	}

	createCells(startTime, endTime, minutesIncrement);
	createCells(startTime2, endTime2, minutesIncrement);
	selectASlot();

}

function createCells(startTime, endTime, minutesIncrement)
{
	while (startTime < endTime)
	{
		var newRow = $('<tr><th><div>' + minutesToFormat(startTime) + '</div></th><td></td></tr>');
		newRow.addClass("removeOnClear");
		newRow.attr("scope", "row");
		
		var minutesVal = $('<span>'+startTime+'</span>');
		minutesVal.addClass('doNotDisplay');
		newRow.append(minutesVal);
		
		startTime = startTime + minutesIncrement
		$('#slotPicker tbody').append(newRow);
	}
	
	var newRow = $('<tr><th></th><th></th></tr>');
	newRow.addClass("removeOnClear blank");
	$('#slotPicker tbody').append(newRow);
	
}

function selectASlot() {
	$("#slotPicker td").click(function () {
		var check = false;

		$("#slotPicker tr td:nth-child(2)").each(function () {
			if (($(this).hasClass("slotSelected")) === true)
				$(this).toggleClass("slotSelected");
		});

		$(this).toggleClass("slotSelected");

	});
}


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
		timeString = hours + ":" + "00 " + format;
	else
		timeString = hours + ":" + minutes + " " + format;

	return timeString;

}


function slice_time(timeText) {

	// format is 'YYYY-MM-DD HH:MM:SS'

    slicedText1 = timeText.split('-'); // 'YYYY', 'MM', 'DD HH:MM:SS'
    slicedText2 = slicedText1[2].split(' '); // 'DD', HH:MM:SS'
	slicedText3 = slicedText2[1].split(':'); // 'HH', 'MM', 'SS'

	// trim leading zero if it exists

	if (slicedText1[1][0] == '0') slicedText1[1] = slicedText1[1].slice(1);
	if (slicedText2[0][0] == '0') slicedText2[0] = slicedText2[0].slice(1);

	if (slicedText3[0][0] == '0') slicedText3[0] = slicedText3[0].slice(1);
	if (slicedText3[1][0] == '0') slicedText3[1] = slicedText3[1].slice(1);
	
	// return object

    return {
        year: slicedText1[0],
        month: slicedText1[1],
        day: slicedText2[0],
        hour: slicedText3[0],
        minute: slicedText3[1]
    }

}

function createTimeSlotObjects() {

    timeSlotTable = document.getElementById('timeSlots');
    tableRows = $(timeSlotTable.getElementsByTagName('tr')).slice(1);

    timeSlotObjects = []

    for (row of tableRows) {

        start_time = slice_time(row.children[0].textContent);

        timeSlot = {
            start_time: start_time,
            capacity: row.children[1].textContent,
            space: row.children[2].textContent,
            full: row.children[3].textContent
        }

        timeSlotObjects.push(timeSlot);

    }

    return timeSlotObjects;

} 


function highlightCalendar() { 

	calendarTitle = document.getElementsByClassName('datepicker-switch')[0].textContent;
	calendarMonth = calendarTitle.split(' ')[0];
	calendarYear = calendarTitle.split(' ')[1];

	for (timeSlot of timeSlotObjects) {

		sameMonth = monthEnum[calendarMonth] == timeSlot.start_time.month;
		sameYear = calendarYear == timeSlot.start_time.year;

		if (!sameMonth || !sameYear) continue;

		calendarDays = $('td[class="day"]');

		for (day of calendarDays) {

			sameDay = day.textContent == timeSlot.start_time.day;

			if (sameDay) day.classList.add('bg-info');

		}

	}

}