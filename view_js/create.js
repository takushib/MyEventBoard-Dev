$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

function checkInput(obj) {

	if (obj.val().length === 0)
	{

		if (obj.hasClass("requiredInput") === true)
		{
			return false;
		}
		else
		{
			obj.addClass("requiredInput");
			return false;
		}
	}
	else
	{
		obj.removeClass("requiredInput");
		return true;
	}
}

$(document).ready(function(){

	var locationsDropDown;
	
	$.getJSON('OSU_locations.json',function(data){
		$.each(data, function(i, locations) {
			
			locations.name = locations.name.replace("'", "&#39");
	
			locationsDropDown += "<option value='"
			+locations.name+
			"'>"+locations.name+"</option>"
			});
		$('#locationInput').append(locationsDropDown);
	});
					
});

function checkIfRequiredElementsAreIncorrect() {
	var eventNameObj = $('#eventNameInput');
	var eventLocationObj = $('#locationInput');
	var eventSlotsObj = $('#timeslotCapInput');
	
	var durations = ["1 Hour", "15 Minutes", "30 Minutes"];
	
	var eventDuration = $('#durationSelector');
	
	if (eventNameObj.val() === "")
		return false;
	if (eventLocationObj.val() === "")
		return false;
	
	var checkIfCorrectInteger = eventSlotsObj.val();
	
	if (checkIfCorrectInteger !== "" && (isNaN(checkIfCorrectInteger) === true || checkIfCorrectInteger < 1)) //isNaN returns true if not an integer
		return false;
	

	if (!(durations.includes(eventDuration.val())))
		return false;
	
	return true;
		
}

function checkIfElementsHaveBeenMaliciouslyChanged() {
		var eventNameObj = $('#eventNameInput');
		var eventLocationObj = $('#locationInput');
		var eventDescriptObj = $('#eventDescriptTextArea');
		var eventSlotsObj = $('#timeslotCapInput');
		
		var eventDuration = $('#durationSelector');
		var eventDates = $('#Dates');
		var timeSelect = $('#timeSelector');
		
		if (!(eventNameObj.is('input')))
			return false;

		if (!(eventLocationObj.is('select')))
			return false;
		
		if (!(eventDescriptObj.is('textarea')))
			return false;

		if (!(eventSlotsObj.is('input')))
			return false;
		
		
		if (!(eventDuration.is('select')))
			return false;
		
		if (!((eventDates.is('[readonly]')) && eventDates.is('input')))
			return false;
		
		if (!(timeSelect.is('table')))
			return false;
		
		return true;
}

function checkIfElementsHaveBeenMaliciouslyRemoved() {
	var eventNameObj = document.getElementById("eventNameInput");
	var eventLocationObj = document.getElementById("locationInput");
	var eventSlotsObj = document.getElementById('timeslotCapInput');
	var eventDescriptTextArea = document.getElementById('eventDescriptTextArea');
	
	var eventDatesObj = document.getElementById('Dates');
	var eventDurationObj = document.getElementById('durationSelector');
	var timeSelectObj = document.getElementById('timeSelector');
	
	if (typeof eventNameObj == undefined || eventNameObj == null)
		return false;

	if (typeof eventLocationObj == undefined || eventLocationObj == null)
		return false;
	
	if (typeof eventSlotsObj == undefined || eventSlotsObj == null)
		return false;
	
	if (typeof eventDescriptTextArea == undefined || eventDescriptTextArea == null)
		return false;
	


	if (typeof eventsDateObj == undefined || eventDatesObj == null)
		return false;
	
	if (typeof eventsDurationObj == undefined || eventDurationObj == null)
		return false;

	if (typeof timeSelectObj == undefined || timeSelectObj == null)
		return false;
	
	return true;
}

				
$(document).ready(function () {

	document.getElementById("field1to2").addEventListener("click", function () {
		
		if (checkIfElementsHaveBeenMaliciouslyRemoved() == false || checkIfElementsHaveBeenMaliciouslyChanged() == false)
		{
			window.location = "./400";
			return;
		}
		
		
		var eventNameObj = $('#eventNameInput');
		var eventLocationObj = $('#locationInput');
		var eventNameCheck = checkInput(eventNameObj);
		var eventLocationCheck = checkInput(eventLocationObj);
		var eventSlotsCheckEmpty = $('#timeslotCapInput');
		
		
		if ( eventNameCheck === true && eventLocationCheck === true)
		{
			if (eventSlotsCheckEmpty.val() === "")
					eventSlotsCheckEmpty.val("1");
				
			$('.entryField1').addClass('collapse');
			$('.entryField2').removeClass('collapse');
			
			
		}
	})

	document.getElementById("field2toSubmit").addEventListener("click", function () {
		
		if (checkIfElementsHaveBeenMaliciouslyRemoved() == false || checkIfElementsHaveBeenMaliciouslyChanged() == false || checkIfRequiredElementsAreIncorrect() == false)
		{
		//	console.log(checkIfElementsHaveBeenMaliciouslyRemoved());
		//	console.log(checkIfElementsHaveBeenMaliciouslyChanged());
		//	console.log(checkIfRequiredElementsAreIncorrect());
			window.location = "./400";
			return;
		}
		
		
		var slots = submitEvent();
		var eventDateInputObj = $('#Dates');

		var eventDateCheck = checkInput(eventDateInputObj);

		if (eventDateCheck === false)  // Must have a date selected
		{
			return;
		}
		else if (slots == false) {
			alert("Please select slots");
		}
		else {
			var totalCap = timeslotCapInput.value * slots.length;
			var slotCap = timeslotCapInput.value;
			var newArr = JSON.stringify(slots);
			$.ajax({
				type: "POST",
				url: "insert_event.php",
				data: {
					eventCreator: myONID,
					eventName: $('#eventNameInput').val(),
					eventLocation: $('#locationInput').val(),
					eventDescription: $('#eventDescriptTextArea').val(),
					eventDuration: getDuration(),
					slotArray: newArr,
					eventCap: totalCap,
					sCap: slotCap
				}
			}).done(function(response) {
    		alert(response);
			});

			$('.entryField2').addClass('collapse');
			$('.submitField').removeClass('collapse');
		}

	})

	document.getElementById("field2to1").addEventListener("click", function () {
		$('.entryField2').addClass('collapse');
		$('.entryField1').removeClass('collapse');
	})

});

$('#durationSelector').on('change', function () {

	$('.removeOnClear').remove(); //Clear all cells
	$('#datepicker').datepicker('update', ''); // clear all dates

	var selectedDuration = $("#durationSelector").val();

	var offset = 0;
	var minutes = 0;
	var hourInMinutes = 60;
	var totalHours = 12;


	switch (selectedDuration) {

		case "15 Minutes":

			var durationOffset = 4;
			var durationSlots = 3;
			var minutesIncrement = 15;
			break;

		case "30 Minutes":

			var durationOffset = 2;
			var durationSlots = 1;
			var minutesIncrement = 30;
			break;

		case "1 Hour":

			return;
			break;

	}

	for (i = 0; i < totalHours; i++) {

		for (j = 0; j < durationSlots; j++) {
			minutes = minutes + minutesIncrement;
			//var min = minutesToFormat(minutes);
			var newRow = $('<tr><th><div>' + minutes + '</div></th></tr>');
			newRow.addClass("removeOnClear");
			newRow.children().children().addClass("doNotDisplay");
			$('#timeSelector tr').eq(offset + j + 1).after(newRow);

		}

		minutes = (hourInMinutes * (i + 1));
		offset = offset + durationOffset;

	}

});


// Menu Toggle Script

$("#menu-toggle").click(function (e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});


$(document).ready(function () {
	$('#createNav').addClass('activeNavItem');
});

// Source: https://jsfiddle.net/christianklemp_imt/b20paum2/

$(document).ready(function () {
	
	$('#datepicker').datepicker({

		startDate: new Date(),
		multidate: true,
		format: "mm/dd/yyyy",
		daysOfWeekHighlighted: "5,6",
		datesDisabled: ['31/08/2017'],
		language: 'en'

	}).on('changeDate', function (e) {

		dragTable(); // Add event handler

		// `e` here contains the extra attributes

		//$(this).find('.input-group-addon .count').text(' ' + e.dates.length);

		//Check if date exists in table
		var hasColumn = $('#timeSelector thead th').filter(function () {
			return this.textContent === e.format();
		}).length > 0;


		//-- check if column date exists.
		if (hasColumn === false && e.format() != "") {
			addNewCol(e); // Add if it is. Otherwise remove it.
			dragTable(); // Add event handler
		}
		else if (hasColumn === false && e.format() == "") // First column remove edge case
		{
			removeColumn();
			dragTable(); // Add event handler
		}
		else if (hasColumn === true && e.format() != "") // Remove columns
		{
			removeColumn();
			dragTable(); // Add event handler
		}

	});

});


function removeColumn() {

	var removedDate;
	var inputString = document.getElementById('Dates').value;

	$("#timeSelector thead tr th").each(function (index) {

		if (index != 0) {

			if (inputString.indexOf($(this).text()) >= 0) {
				// Date is still selected. Keep searching.
			}
			else {

				removedDate = $(this).text();

				index++;

				$('#timeSelector tr td:nth-child(' + index + ')').each(function () {
					//$(this).text("");
					//$(this).removeClass("selected");
					$(this).remove();
				});

				$(this).remove();

				return;

			}
		}

	});

}


function addNewCol(e) {

	var dateName = e.format();
	var newDateHeader = $('<th></th>');
	newDateHeader.text(e.format());
	newDateHeader.addClass("removeOnClear");
	$("#timeSelector tr:first").append(newDateHeader);

	var newDateColumn = $('<td></td>');
	var timeDialogue = $('<div></div>');


	timeDialogue.addClass('doNotDisplay');

	newDateColumn.append(timeDialogue);
	newDateColumn.addClass("removeOnClear");
	$("#timeSelector tr").not(':first').not(':last').append(newDateColumn);

}

function formatDate(currDate) {
	var year = currDate.substr(-4);
	var month = currDate.slice(0,2);
	var day = currDate.slice(3,5);
	var newDate = year + "-" + month + "-" + day;
	return newDate;
}



function formatTime(temp) {
	var totalMinutes = parseInt(temp, 10);
	var startHour = 7;
	var hours = startHour + Math.floor(totalMinutes / 60);
	var minutes = totalMinutes % 60;
	if (minutes == 0) {
		return hours + ":" + minutes + "0";
	}
	return hours + ":" + minutes;
}

function getDuration() {
	var tempS = document.getElementById("durationSelector").value;
	var duration;
	switch(tempS) {
		case "15 Minutes":
			duration = 15;
			break;

		case "30 Minutes":
			duration = 30;
			break;

		case "1 Hour":
			duration = 60;
			break;
	}

	return duration;
}
function formatEndTime(temp) {
	var tempS = document.getElementById("durationSelector").value;
	var totalMinutes = parseInt(temp, 10);
	var duration;
	switch(tempS) {
		case "15 Minutes":
			duration = 15;
			break;

		case "30 Minutes":
			duration = 30;
			break;

		case "1 Hour":
			duration = 60;
			break;
	}
	var newTime = totalMinutes + duration;
	return formatTime(newTime);
}

function submitEvent() {

	var num = 0;

	var slotArray = [];
	var hasSelected;

	$("#timeSelector thead tr th").each(function (index) {

		if (index != 0) {

			var currDate = $(this).text();
			index++;

			hasSelected = false;

			$('#timeSelector tr td:nth-child(' + index + ')').each(function () {

				if ($(this).hasClass("selected")) {
					var date = formatDate(currDate);
					var currTime = $(this).closest('tr').find('th').children().text();
					var slot = {
						startDate: date + " " + formatTime(currTime),
						endDate: date + " " + formatEndTime(currTime)
					};
				//	console.log(slot.startDate);
				//	console.log(slot.endDate);
					slotArray.push(slot);
					hasSelected = true;
				}

			});

			if (hasSelected === false) return false; //break out of statement

		}
	});

	if (hasSelected == false) {
		return false; // return false if not all column have a selected time
 	}
	else {
		return slotArray;
	}

}


function dragTable() {

	// Source: http://jsfiddle.net/few5E/

	var isMouseDown = false;
	var textHolder;

	$("#timeSelector td").mousedown(function () {

			isMouseDown = true;
			$(this).toggleClass("selected");

			return false; // prevent text selection

		}).mouseover(function () {

			if (isMouseDown) {
				$(this).toggleClass("selected");
			}

		});

	$(document).mouseup(function () {
		isMouseDown = false;
	});

}