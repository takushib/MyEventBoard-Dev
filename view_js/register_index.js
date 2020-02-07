// checks if a time slot has been selected. Return the selected obj if true. Otherwise return false
function getColumnSelect()
{
	var check = false;
	var obj;
	$("#slotPicker tr td:nth-child(2)").each(function () {
			if (($(this).hasClass("slotSelected")) === true)
			{
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


$("#submitButton").click(function () {

		var check = getColumnSelect();

		if (check === false)
			alert("Please pick a slot");
		else
		{
			console.log(check.parent().attr('id'));
			$.ajax({
    		type: "POST",
    		url: "reserve_slot.php",
    		data: {
				 	key: check.parent().attr('id'),
					user_id: 0
	    	 }
			}).done(function(response) {
    		if (response == -1) {
					alert("UH OH");
					check.parent().addClass("fullSlot");
				}
				else if (response == 0) {
					check.parent().addClass("fullSlot");
					$('#myModal').modal('toggle');
					$('#feedBackModal').modal('toggle');
				}
				else {
					$('#myModal').modal('toggle');
					$('#feedBackModal').modal('toggle');
					// went through
				}
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


$(function () {
	$("#datepicker2").datepicker({
		startDate: new Date(),
		multidate: false,
		maxDate: "+4m",
		format: "m/d/yyyy",
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
		$('#myModal').modal('toggle');
		$('.modal-body h2').text(e.format());
		createFields();

	});

	document.getElementById('datepicker2').addEventListener('click', highlightCalendar);

});

function twentyFourFormatToMinutes(hour, minute)
{
	return (parseInt((hour * 60),10) + parseInt(minute, 10));
}



function calcStartTime()
{
	var obj = timeSlotObjects;

	var objLength = timeSlotObjects.length;

	console.log(objLength);
	var test = timeSlotObjects[0].start_time.hour;
	var test2 = timeSlotObjects[1].start_time.hour;
}


function createFields() {

	$('.removeOnClear').remove(); //Clear all cells

	var selectedDuration = timeSlotObjects[0].duration;
	var slotId = [];
	var selectedDate = $('.modal-body h2').text();
	var objLength = timeSlotObjects.length;

	var times = [];
	var tempDateHolder;   // checks for the selected Date
	var isAvailable = [];


	for (var i = 0; i < objLength; i++) // store current day times into an array to loop through
	{
		tempDateHolder = timeSlotObjects[i].start_time.month + "/" + timeSlotObjects[i].start_time.day + "/" + timeSlotObjects[i].start_time.year;

		if (selectedDate.localeCompare(tempDateHolder) === 0)
		{
			slotId.push(timeSlotObjects[i].id);
			times.push(twentyFourFormatToMinutes(timeSlotObjects[i].start_time.hour, timeSlotObjects[i].start_time.minute));
			isAvailable.push(timeSlotObjects[i].full);
		}
	}

	for (var i = 0; i < times.length; i++)
	{
		if (i === 0)
		{
			createCells(times[i], isAvailable[i], slotId[i]);
			selectASlot();
			continue;
		}

		if (parseInt(times[i-1],10) + parseInt(selectedDuration, 10) !== parseInt(times[i], 10))
		{
			addBlankSpace();
			createCells(times[i], isAvailable[i], slotId[i]);
		}
		else
		{
			createCells(times[i], isAvailable[i], slotId[i]);
		}

		selectASlot();

	}
}

function addBlankSpace()
{
	var newRow = $('<tr><th></th><th></th></tr>');
	newRow.addClass("removeOnClear blank");
	$('#slotPicker tbody').append(newRow);
}

function createCells(startTime, isFull, id)
{
		var newRow = $('<tr><th><div>' + totalMinutesToFormat(startTime) + '</div></th><td></td></tr>');
		newRow.attr('id',id);
		newRow.addClass("removeOnClear");
		if (isFull == 1)
		{
			newRow.addClass("fullSlot");
		}
		newRow.attr("scope", "row");

		var minutesVal = $('<span>'+startTime+'</span>');
		minutesVal.addClass('doNotDisplay');
		newRow.append(minutesVal);

		$('#slotPicker tbody').append(newRow);

}

function selectASlot() {
	$("#slotPicker td").click(function () {

		if ($(this).parent().hasClass('fullSlot'))
			return;

		var check =  getColumnSelect();

		if (check === false)
			$(this).toggleClass("slotSelected");
		else
		{
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

        start_time = slice_time(row.children[1].textContent);

        timeSlot = {
						id: row.children[0].textContent,
						start_time: start_time,
						duration: row.children[2].textContent,
            capacity: row.children[3].textContent,
            space: row.children[4].textContent,
            full: row.children[5].textContent
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
