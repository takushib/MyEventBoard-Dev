// checks if a time slot has been selected. Return the selected obj if true. Otherwise return false

function getColumnSelect() {
	var check = false;
	var obj;
	$("#slotPicker tr td:nth-child(2)").each(function () {
		if (($(this).hasClass("slotSelected")) === true) {
			check = true;
			obj = $(this);
			return;	// break out of loop
		}
	});

	if (check === true)
		return obj;
	else
		return false;
}


// for time slot in modal, set its color to red and set space to 0
// for time slot object, set space to 0 and set full to 1

function setFullSlot(modalTimeSlot, timeSlotObject) {

	modalTimeSlot.parent().addClass("fullSlot");
	modalTimeSlot[0].textContent = 0;

	timeSlotObject.space = 0;
	timeSlotObject.full = 1;

}


$("#submitButton").click(function () {

	var selectedSlot = getColumnSelect();

	if (selectedSlot === false)
		alert("Please pick a slot.");
	else {

		var slotKey = selectedSlot.parent().attr('id');
		console.log(selectedSlot.parent().attr('id'));

		$.ajax({
			type: "POST",
			url: "reserve_slot.php",
			data: {
				key: slotKey,
				user_id: 1
			}
		}).done(function (response) {
			
			if (response <= -1) {
				setFullSlot(selectedSlot, timeSlotObjects[slotKey]);
				document.getElementById('feedbackMessage').textContent = 
					"The time slot was full! Please select another one!";
				$('#feedBackModal').modal('toggle');
			}
			else if (response == 0) {
				setFullSlot(selectedSlot, timeSlotObjects[slotKey]);
				document.getElementById('feedbackMessage').textContent = "You have been registered!";
				$('#myModal').modal('toggle');
				$('#feedBackModal').modal('toggle');
			}
			else {
				$('#myModal').modal('toggle');
				$('#feedBackModal').modal('toggle');
				timeSlotObjects[slotKey].space = response;
			}

			selectedSlot[0].classList.remove('slotSelected');

		});

	}
});


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

$(document).ready(function () {

	timeSlotObjects = createTimeSlotObjects();
	document.getElementById('timeSlots').remove();

});

function formatDate(d) {
	var day = String(d.getDate())

	var month = String((d.getMonth() + 1))

	return month + "/" + day + "/" + d.getFullYear()
}

$(function () {
	var selectableDates = getSelectableDates();
	console.log(selectableDates);

	$("#datepicker2").datepicker({
		startDate: new Date(),
		multidate: false,
		endDate: "+3m",
		beforeShowDay: function (date) {
			if (selectableDates.includes(formatDate(date)) === true) {
				return { enabled: true }
			}
			else
				return { enabled: false }
		},
		format: "m/d/yyyy",
		language: 'en'
	});

	highlightCalendar();
});


// Source: https://jsfiddle.net/christianklemp_imt/b20paum2/
$(document).ready(function () {

	$('#datepicker2').datepicker().on('changeDate', function (e) {

		$('#myModal').modal('toggle');
		$('.modal-body h2').text(e.format());
		createFields();

	});

	document.getElementById('datepicker2').addEventListener('click', highlightCalendar);

});

function twentyFourFormatToMinutes(hour, minute) {
	return (parseInt((hour * 60), 10) + parseInt(minute, 10));
}



function calcStartTime() {
	var obj = timeSlotObjects;

	var objLength = timeSlotObjects.length;
	console.log(objLength);

	var timeSlotKeys = Object.keys(timeSlotObjects)
	var test = timeSlotObjects[timeSlotKeys[0]].start_time.hour;
	var test2 = timeSlotObjects[timeSlotKeys[1]].start_time.hour;
}


function createFields() {

	$('.removeOnClear').remove(); //Clear all cells

	var timeSlotKeys = Object.keys(timeSlotObjects);
	var selectedDuration = timeSlotObjects[timeSlotKeys[0]].duration;
	
	var selectedDate = $('.modal-body h2').text();
	var tempDateHolder;   // checks for the selected Date

	var times = [];
	var spaces = [];
	var isAvailable = [];
	var slotIDs = [];


	for (var timeSlotKey of timeSlotKeys) // store current day times into an array to loop through
	{

		var timeSlot = timeSlotObjects[timeSlotKey];

		tempDateHolder = timeSlot.start_time.month + "/" + timeSlot.start_time.day + "/" + timeSlot.start_time.year;

		if (selectedDate.localeCompare(tempDateHolder) === 0) {
			times.push(twentyFourFormatToMinutes(timeSlot.start_time.hour, timeSlot.start_time.minute));
			spaces.push(timeSlot.space);
			isAvailable.push(timeSlot.full);
			slotIDs.push(timeSlot.id);
		}

	}

	for (var i = 0; i < times.length; i++) {

		if (i === 0) {
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i]);
			selectASlot();
			continue;
		}

		if (parseInt(times[i - 1], 10) + parseInt(selectedDuration, 10) !== parseInt(times[i], 10)) {
			addBlankSpace();
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i]);
		}
		else {
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i]);
		}

		selectASlot();

	}
}

function addBlankSpace() {
	var newRow = $('<tr><th></th><th></th></tr>');
	newRow.addClass("removeOnClear blank");
	$('#slotPicker tbody').append(newRow);
}

function createCells(startTime, spaceAvailable, isFull, id) {

	var rowContent = '<tr><th><div>' + totalMinutesToFormat(startTime);
	rowContent += '</div></th><td>' + spaceAvailable +'</td></tr>'

	var newRow = $(rowContent);
	newRow.attr('id', id);
	newRow.addClass("removeOnClear");
	if (isFull == 1) {
		newRow.addClass("fullSlot");
	}
	newRow.attr("scope", "row");

	var minutesVal = $('<span>' + startTime + '</span>');
	minutesVal.addClass('doNotDisplay');
	newRow.append(minutesVal);

	$('#slotPicker tbody').append(newRow);

}

function selectASlot() {
	$("#slotPicker td").click(function () {

		if ($(this).parent().hasClass('fullSlot'))
			return;

		var check = getColumnSelect();

		if (check === false)
			$(this).toggleClass("slotSelected");
		else {
			check.toggleClass("slotSelected");
			$(this).toggleClass("slotSelected");

		}
	});
}


function totalMinutesToFormat(totalMinutes) {
	totalMinutes = totalMinutes + "";

	if (totalMinutes.search("AM") != -1 || totalMinutes.search("PM") != -1) {
		return totalMinutes;
	}

	var timeString;

	var hours = Math.floor(totalMinutes / 60);
	var minutes = parseInt(totalMinutes) % 60;

	var format;

	if (hours > 12) {
		hours = hours - 12;
		format = "PM";
	}
	else if (hours === 12) {
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

	var slicedText1 = timeText.split('-'); // 'YYYY', 'MM', 'DD HH:MM:SS'
	var slicedText2 = slicedText1[2].split(' '); // 'DD', HH:MM:SS'
	var slicedText3 = slicedText2[1].split(':'); // 'HH', 'MM', 'SS'

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

	var timeSlotObjects = {};

	for (var row of tableRows) {

		var start_time = slice_time(row.children[1].textContent);

		var timeSlot = {
			id: row.children[0].textContent,
			start_time: start_time,
			duration: row.children[2].textContent,
			capacity: row.children[3].textContent,
			space: row.children[4].textContent,
			full: row.children[5].textContent
		}

		timeSlotObjects[timeSlot.id] = timeSlot;

	}

	return timeSlotObjects;

}

function getSelectableDates() {
	var enableDays = [];
	var tempDateHolder;   // checks for the selected Date

	for (var timeSlotKey of Object.keys(timeSlotObjects)) // store current day times into an array to loop through
	{
		var timeSlot = timeSlotObjects[timeSlotKey];

		tempDateHolder = timeSlot.start_time.month + "/" + timeSlot.start_time.day + "/" + timeSlot.start_time.year;

		if (enableDays.includes(tempDateHolder) === true)
			continue;
		enableDays.push(tempDateHolder);
	}
	console.log(enableDays);
	return enableDays;
}

function highlightCalendar() {

	var calendarTitle = document.getElementsByClassName('datepicker-switch')[0].textContent;
	var calendarMonth = calendarTitle.split(' ')[0];
	var calendarYear = calendarTitle.split(' ')[1];

	for (var timeSlotKey of Object.keys(timeSlotObjects)) {

		var timeSlot = timeSlotObjects[timeSlotKey];

		var sameMonth = monthEnum[calendarMonth] == timeSlot.start_time.month;
		var sameYear = calendarYear == timeSlot.start_time.year;

		if (!sameMonth || !sameYear) continue;

		var calendarDays = $('td[class="day"]');

		for (day of calendarDays) {

			var sameDay = day.textContent == timeSlot.start_time.day;

			if (sameDay) day.classList.add('bg-info');
		}

	}

}
