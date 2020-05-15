var weekday = new Array(7);

weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";



// Returns week day name of a date obj

function getDayName(dateObj) {
	var date = dateObj.datepicker('getDate');
	var dayOfWeek = weekday[date.getUTCDay()];
	return dayOfWeek;
}


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

// for time slot in modal, set its color to green and replace number with checkmark
// for time slot object, mark it as taken by current user

function setMySlot(modalTimeSlot, timeSlotObject) {

	modalTimeSlot.parent().addClass("mySlot");
	modalTimeSlot[0].textContent = '✔';

	timeSlotObject.my_slot = 1;

}


function getCurrentTime() {

	var date = new Date();
	var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
	var AM_PM = date.getHours() >= 12 ? "PM" : "AM";
	hours = hours < 10 ? hours : hours;
	var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

	time = hours + ":" + minutes + " " + AM_PM;
	return time;

};

function checkTimeIfLessThanToday(timeToBeChecked, todaysTime) {

	if (!((timeToBeChecked.includes("AM") || timeToBeChecked.includes("PM") || todayTimeStamp.includes("PM") || todayTimeStamp.includes("AM"))))
	{
		alert("incorrect arguments");
		return false;
	}


	var checkedArrayHour = timeToBeChecked.split(":");
	var todayArrayHour = todaysTime.split(":");

	var checkedMinutesArray = checkedArrayHour[1].split(" ");
	var todayMinutesArray = todayArrayHour[1].split(" ");

	if (checkedMinutesArray[0].charAt(0) == '0')
		checkedMinutesArray[0] = checkedMinutesArray[0].replace('0','');

	if (todayMinutesArray[0].charAt(0) == '0')
		todayMinutesArray[0] = todayMinutesArray[0].replace('0','');

	if (checkedMinutesArray[1] == 'PM' & checkedArrayHour[0] != "12")
		checkedArrayHour[0] = checkedArrayHour[0] + 12;

	if (todayMinutesArray[1] == 'PM' & todayArrayHour[0] != "12")
		todayArrayHour[0] = todayArrayHour[0] + 12;


	var checkTime = parseInt(checkedArrayHour[0]) * 60 + parseInt(checkedMinutesArray[0]);
	var todayTime = parseInt(todayArrayHour[0]) * 60 + parseInt(todayMinutesArray[0])



	if (checkTime < todayTime)
		return true;
	else
		return false;
}

function getTodayDate() {

	// Returns mm/dd/yyyy

	var today = new Date();
	var dd = today.getDate();

	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	return mm+'/'+dd+'/'+yyyy;

}

function resetMySlot(timeSlotObjects) {

	$('.mySlot td').text("");
	$('.mySlot').removeClass("mySlot");

	var timeSlotKeys = Object.keys(timeSlotObjects);

	for (var timeSlotKey of timeSlotKeys) // store current day times into an array to loop through
	{
		var timeSlot = timeSlotObjects[timeSlotKey];
		if(timeSlot.my_slot == 1) {
			timeSlot.my_slot = 0;
		}
	}

}

$('#myModal').on('hidden.bs.modal', function () {
	$('#submitButton').off();
});

var previous_slot = null;

function saveRegister() {

	//console.log("Test");
	var selectedSlot = getColumnSelect();

	var selectedDate = $('#dateLabel').text();

	var curDate = getTodayDate();
	//console.log(curDate);
	//console.log(selectedDate);


	if (selectedSlot === false) {
		alert("Please pick a slot.");
		addSubmitListenerToSubmitButton();
	}
	else if (checkTimeIfLessThanToday(selectedSlot.prev().children().text(), getCurrentTime()) == true && selectedDate === curDate) {
		alert("This slot is past the current time. Please pick a different slot");
		addSubmitListenerToSubmitButton();
	}
	else {
		var slotKey = selectedSlot.parent().attr('id');
		previous_slot = slotKey;
		$.ajax({
			type: "POST",
			url: "reserve_slot.php",
			data: {
				key: slotKey,
				start_time: $('.slotSelected').prev().children().text(),
				date: $('#dateLabel').text(),
				duration: timeSlotObjects[slotKey].duration + " minutes",
			}
		}).done(function (response) {

			if (response <= -1) {
				setFullSlot(selectedSlot, timeSlotObjects[slotKey]);
				document.getElementById('feedbackMessage').textContent =
					"The time slot was full! Please select another one!";
				$('.fileUpload').addClass('doNotDisplay');
				$('#feedBackModal').modal('toggle');

				addSubmitListenerToSubmitButton();
			}
			else if (response == 0) {
				resetMySlot(timeSlotObjects);
				setFullSlot(selectedSlot, timeSlotObjects[slotKey]);
				setMySlot(selectedSlot, timeSlotObjects[slotKey]);
				document.getElementById('feedbackMessage').textContent = "You have been registered!";
				$('.fileUpload').removeClass('doNotDisplay');
				$('#myModal').modal('toggle');
				$('#feedBackModal').modal('toggle');
			}
			else {

				resetMySlot(timeSlotObjects);

				setMySlot(selectedSlot, timeSlotObjects[slotKey]);
				$('#myModal').modal('toggle');
				$('#feedBackModal').modal('toggle');
				timeSlotObjects[slotKey].space = response;
			}
			monthDayAvailableSpace = getMonthDayAvailableSpace();

			selectedSlot[0].classList.remove('slotSelected');

		});

	}
}


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
	monthDayAvailableSpace = getMonthDayAvailableSpace();
	document.getElementById('timeSlots').remove();

});

function formatDate(d) {
	var day = String(d.getDate())

	var month = String((d.getMonth() + 1))

	return month + "/" + day + "/" + d.getFullYear()
}

$(function () {

	var timeSlotKeys = Object.keys(timeSlotObjects);
	var eventLocation = timeSlotObjects[timeSlotKeys[0]].event_location;

	var eventDesLabel = "Event Description ";

	$('#eventLocation').append(eventLocation);
	var eventDescription = timeSlotObjects[timeSlotKeys[0]].description;

	if (eventDescription == "" || eventDescription == undefined || eventDescription == null)
	{
		// do nothing
	}
	else
	{
		$('#eventDescriptionLabel').append(eventDesLabel);
		$('#eventDescription').append(eventDescription);
	}


	var selectableDates = getSelectableDates();
	var cur_date = new Date();
	cur_date.setHours(0,0,0,0);

	var past_event = true;

	for (let i = 0; i < selectableDates.length; i++) {
		var try_date = new Date(selectableDates[i]);

		if (try_date >= cur_date)
		{
			past_event = false;
		}
	}


	if (past_event == true) {
		$('#datepicker2').remove();
		$('.calendarField').append('<h2> This Event has Expired <i class="fa fa-frown-o" aria-hidden="true"></i></h2>');
		return;

	}

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

function addSubmitListenerToSubmitButton() {
	$("#submitButton").one('click', function () {
		saveRegister();
	});
}

// Source: https://jsfiddle.net/christianklemp_imt/b20paum2/
$(document).ready(function () {

	if($('#datepicker2') != undefined || $('#datepicker2') != null)  {

		$('#datepicker2').datepicker().on('changeDate', function (e) {

			$('#myModal').modal('toggle');

			var dayOfWeek = getDayName($(this));
			$('.modal-body #dayLabel').text(dayOfWeek);
			$('.modal-body #dateLabel').text(e.format());
			createFields();

			addSubmitListenerToSubmitButton();

		});

		if (document.getElementById('datepicker2') != null || document.getElementById('datepicker2') != undefined)
			document.getElementById('datepicker2').addEventListener('click', highlightCalendar);
	}
});

function twentyFourFormatToMinutes(hour, minute) {
	return (parseInt((hour * 60), 10) + parseInt(minute, 10));
}



function calcStartTime() {
	var obj = timeSlotObjects;

	var objLength = timeSlotObjects.length;

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
	var isMySlot = [];


	for (var timeSlotKey of timeSlotKeys) // store current day times into an array to loop through
	{

		var timeSlot = timeSlotObjects[timeSlotKey];

		tempDateHolder = timeSlot.start_time.month + "/" + timeSlot.start_time.day + "/" + timeSlot.start_time.year;

		if (selectedDate.localeCompare(tempDateHolder) === 0) {
			times.push(twentyFourFormatToMinutes(timeSlot.start_time.hour, timeSlot.start_time.minute));
			spaces.push(timeSlot.space);
			isAvailable.push(timeSlot.full);
			slotIDs.push(timeSlot.id);
			isMySlot.push(timeSlot.my_slot);
		}

	}

	for (var i = 0; i < times.length; i++) {

		if (i === 0) {
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i], isMySlot[i]);
			selectASlot();
			continue;
		}

		if (parseInt(times[i - 1], 10) + parseInt(selectedDuration, 10) !== parseInt(times[i], 10)) {
			addBlankSpace();
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i], isMySlot[i]);
		}
		else {
			createCells(times[i], spaces[i], isAvailable[i], slotIDs[i], isMySlot[i]);
		}

		selectASlot();

	}
}

function addBlankSpace() {
	var newRow = $('<tr><th></th><th></th></tr>');
	newRow.addClass("removeOnClear blank");
	$('#slotPicker tbody').append(newRow);
}

function createCells(startTime, spaceAvailable, isFull, id, isMySlot) {

	var rowContent = '<tr><th><div>' + totalMinutesToFormat(startTime);
	if (isMySlot != 1) {
		rowContent += '</div></th><td>' + spaceAvailable +'</td></tr>';
	}
	else {
		rowContent += '</div></th><td>' + '✔' +'</td></tr>';
	}

	var newRow = $(rowContent);
	newRow.attr('id', id);
	newRow.addClass("removeOnClear");

	if (isFull == 1) {
		newRow.addClass("fullSlot");
	}

	if (isMySlot == 1) {
		newRow.addClass("mySlot");
	}

	newRow.attr("scope", "row");

	var minutesVal = $('<span>' + startTime + '</span>');
	minutesVal.addClass('doNotDisplay');
	newRow.append(minutesVal);

	$('#slotPicker tbody').append(newRow);

}

function selectASlot() {
	$("#slotPicker td").click(function () {

		if ($(this).parent().hasClass('fullSlot') || $(this).parent().hasClass('mySlot')) return;

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
			full: row.children[5].textContent,
			description: row.children[6].textContent,
			event_location: row.children[7].textContent,
			my_slot: row.children[8].textContent
		}

		timeSlotObjects[timeSlot.id] = timeSlot;

	}

	return timeSlotObjects;

}

function getMonthDayAvailableSpace() {

	var monthDayAvailableSpace = {};
	var objectKeys = Object.keys(timeSlotObjects);

	// for each time slot object, do the following

	for (var key of objectKeys) {

		var month = timeSlotObjects[key].start_time.month;
		var day = timeSlotObjects[key].start_time.day;
		var space = timeSlotObjects[key].space

		// if data object does not have month key
		// add key and assign empty object as initial value

		if (!monthDayAvailableSpace[month]) monthDayAvailableSpace[month]= {};

		// if object for month key does not have day key
		// add key and assign 0 as initial value

		if (!monthDayAvailableSpace[month][day]) monthDayAvailableSpace[month][day] = 0;

		// add available space for time slot to total
		// for month and day in data object

		monthDayAvailableSpace[month][day] += Number(space);

	}

	return monthDayAvailableSpace;

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

			var space = monthDayAvailableSpace[monthEnum[calendarMonth]][day.textContent];

			if (sameDay && space > 0) day.classList.add('bg-info');

			if (space <= 0) {
				day.classList.add('bg-danger');
				day.classList.add('disabled');
				day.style.color = 'black';
			}

		}

	}

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
	return enableDays;
}
