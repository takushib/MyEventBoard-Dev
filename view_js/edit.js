const fileUploadType = "FILEUPLOAD";
const anonymousCheckType = "ANONYMOUS";
const capacityType = "CAPACITY";
const durationType = "DURATION";
const EVENT_DESCRIPT_LIST_LABEL = "EVENT_DESCRIPTION";
const confirmationTypeList = [fileUploadType, anonymousCheckType, capacityType, durationType];
const eventDeleteIndex = 1;

const stateOfEvent = {
						name: "",
						eventDate: "",
						capacity: "",
						duration: "", 
						fileOption: false,
						anonymousOption: true,
						slots: []
					 };

stateOfEvent.capacity = $('#timeslotCapInput').val();
stateOfEvent.duration = $('#durationSelector option:selected');

const weekday = new Array(7);

weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";


// Returns week day name of a date obj
function getDayName(dateObj) {
	var dayOfWeek = weekday[dateObj.getUTCDay()];
	return dayOfWeek;
}

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})


$(function initState() {
	
	// Initialize the state here (stateOfEvent variable)
});

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
				
$(document).ready(function () {

	document.getElementById("field1to2").addEventListener("click", function () {
	
			
		$('.entryField1').addClass('collapse');
		$('.entryField2').removeClass('collapse');
			
			
		
	})

	document.getElementById("field2to1").addEventListener("click", function () {
		$('.entryField2').addClass('collapse');
		$('.entryField1').removeClass('collapse');
	})
	
});


// Menu Toggle Script

$("#menu-toggle").click(function (e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
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
	
	$("#timeSelector tr").not(':first').not(':last').each(function() {
		
		var time = formatTime($(this).children().find('div').text());
		var date = formatDate(newDateHeader.text());
		var startValCheckForDupe = [{
										startDate: (date + " " + time), 
										endDate: null}
								   ];
	
		if (arraysNoDuplicate(stateOfEvent.slots, startValCheckForDupe) == false)
			$(this).children().last().addClass("fullSlot");
	});

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


function formatEndTime(temp) {
	var duration = parseInt($('#durationSelector').find(":selected").val(), 10);
	var totalMinutes = parseInt(temp, 10);
	
	var newTime = totalMinutes + duration;
	return formatTime(newTime);
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



$('.deleteEvent').on('click', function () {
	deleteSelectedEvent($(this));
})

function updateStateFromDelete(startDateValToBeRemoved) {

		console.log(startDateValToBeRemoved);
		for(let i=0; i < stateOfEvent.slots.length; i++)
		{
			if(stateOfEvent.slots[i].startDate == startDateValToBeRemoved)
			{	
				stateOfEvent.slots.splice(i, 1);
			}	
		}
	
}

function deleteSelectedEvent(selectedEvent) {
	$('#deleteMassSubmitButton').off();
	$('#deleteMassSubmitButton').attr('id', "deleteSubmitButton");
	$('#deleteSubmitButton').off();
	$('#deleteConfirm').modal('toggle');

	var deleteObjInfo = getEventInFormatFromTableCells(selectedEvent.parent().parent());
	var listItem = $('<li> ' + deleteObjInfo.displayValue + ' </li>');
	listItem.addClass('list-group-item');
	$('.containerForEventsToDelete ul').append(listItem);
		
	$('#deleteSubmitButton').on('click', function () {
		selectedEvent.parent().parent().remove();

		updateStateFromDelete(deleteObjInfo.deleteValue);
		$('#deleteConfirm').modal('toggle');
		$('#feedBackModalDelete').modal('toggle');
		//console.log(stateOfEvent.slots);
	})
}

function getEventInFormatFromTableCells(tableRow) {
	var formattedEventString = [];
	
	tableRow.find('td').not(':last').each(function() {
		formattedEventString.push($(this).text());
	});
	
	
	var yyyy_mm_dd_format = formatDate(formattedEventString[0]); 
	
	var formatStringObj = {
						displayValue: formattedEventString[0] + ", " + formattedEventString[1] + ", " + formattedEventString[2] + " - " + formattedEventString[3],
						deleteValue: yyyy_mm_dd_format + " " + convertAMPMToMilitary(formattedEventString[2])
					   }
	return formatStringObj;
}

function massDelete(arrayWithReadyToDeleteEventRows) {
	$('#deleteSubmitButton').off();
	$('#deleteSubmitButton').attr('id', "deleteMassSubmitButton");
	$('#deleteMassSubmitButton').off();
	$('#deleteConfirm').modal('toggle');

	var arrayOfEventSlotsToDelete = [];
	
	arrayWithReadyToDeleteEventRows.forEach(number => {
		var deleteObjInfo = getEventInFormatFromTableCells(number);
		arrayOfEventSlotsToDelete.push(deleteObjInfo.deleteValue);
		var listItem = $('<li> ' + deleteObjInfo.displayValue + ' </li>');
		listItem.addClass('list-group-item');
		$('.containerForEventsToDelete ul').append(listItem);
	});
	
	$('#deleteMassSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
	
		//console.log(arrayOfEventSlotsToDelete);
		for (let i = 0; i < arrayOfEventSlotsToDelete.length; i++)
		{
			updateStateFromDelete(arrayOfEventSlotsToDelete[i]);
			arrayWithReadyToDeleteEventRows[i].remove();
		}
		/*	arrayWithReadyToDeleteEvents.forEach(number => {
			$.ajax({
				url: "delete_event.php",
				type: "POST",
				data: { key: number.parent().children().eq(currPosition).text() },
			}).done(function (response) {
				console.log(response);
			});
			number.parent().remove();
			
		}); */
		//arrayOfEventSlotsToDelete = [];
		//console.log(stateOfEvent.slots);
 		$('#feedBackModalDelete').modal('toggle');
	})

}


$('#deleteConfirm').on('hidden.bs.modal', function () {
	$('.list-group-item').remove();
});

$('.deleteSelectButton').on('click', function () {
	
	$('.massDeleteOn').each(function() {
		$($(this)).prop('checked', false);
	});
	
	$('.deleteSelectButton').toggleClass('toggled');
	$('.massDeleteOn').toggleClass('doNotDisplay');
	$('.deleteEvent').toggleClass('doNotDisplay');
	$('.deleteSelectButtonConfirm').toggleClass('doNotDisplay');
})

$('.deleteSelectButtonConfirm').on('click', function () {

	// Loop through last column and delete selected
	var atLeastOnSelected = false;
	var tempHolder = [];

	
	$("#existingEventsTable tr td:nth-last-child( " + eventDeleteIndex + " )").each(function () {
		if ($(this).children().prop("checked")) {
			tempHolder.push($(this).parent());
			atLeastOnSelected = true;
		}
	});
	
	if (atLeastOnSelected == false)
		alert("No Event Selected");
	else
		massDelete(tempHolder);

});

$('#generalConfirm').on('hidden.bs.modal', function () {
	
	resetCanceledInput();
	clearModal();
});

function resetCanceledInput() {
	
	var findSelectedDuration = $('#durationSelector').find(":selected");
	
	if (stateOfEvent.duration.val() != findSelectedDuration.val())
		$('#durationSelector').find('option[value="'+ stateOfEvent.duration.val() +'"]').prop('selected', 'selected');

	if (stateOfEvent.capacity != $('#timeslotCapInput').val())
		$('#timeslotCapInput').val(stateOfEvent.capacity);
}

function clearModal() {
	
	$('.confirmationDescriptionContainer').empty();
	$('#generalAcceptButton').off();
	$('#generalCancelButton').off();
	$('.close').off();
	$('#generalHeaderLabel').text("");
};

function buildModalForChangeConfirmation(modalHeaderName, description) {
	
	$('#generalHeaderLabel').text(modalHeaderName);
	
	var warningLabel = $('<label>*Warning*</label>');
	warningLabel.attr("id", "warningTag");
	var warningMessage = $('<text> '+description+' </text>');
	warningMessage.attr("id", "confirmationDescription");
	
	$('.confirmationDescriptionContainer').append(warningLabel);
	$('.confirmationDescriptionContainer').append('<br>');
	$('.confirmationDescriptionContainer').append('<br>');
	$('.confirmationDescriptionContainer').append(warningMessage);
	
	$('#generalAcceptButton').off();
	$('#generalCancelButton').off();
	
}

function callCheckConfirmation(confirmationType) {
	if (confirmationTypeList.includes(confirmationType))
	{		
		switch(confirmationType) {
		
			case fileUploadType:
				
				buildModalForChangeConfirmation("Confirm Change", "Unchecking the File Upload Check box will cause files currently uploaded to this event to be deleted");
				$('#generalConfirm').modal('toggle');
				
				$('#generalAcceptButton').on('click', function() {
					$('#generalConfirm').modal('toggle');
					$('#fileUpload').prop("checked", !$('#fileUpload').prop("checked"));
				});
				
				break;
				
			case anonymousCheckType:
				
				buildModalForChangeConfirmation("Confirm Change", "Unchecking the Anonymous Check box will make registered users visible to other users upon event registration.");
				$('#generalConfirm').modal('toggle');
				
				$('#generalAcceptButton').on('click', function() {
					$('#generalConfirm').modal('toggle');
					$('#anonymousCheck').prop("checked", !$('#anonymousCheck').prop("checked"));
				});
				
				break;
				
			case capacityType:
				
				buildModalForChangeConfirmation("Confirm Change", "Changing the slot capacity may cause currently booked users to be removed off the event in the case the number of booked users exceeds the changed value.");
				
				$('#generalConfirm').modal('toggle');
				
				$('#generalAcceptButton').on('click', function() {
					$('#generalConfirm').modal('toggle');
					stateOfEvent.capacity = $('#timeslotCapInput').val();
				});

				break;
			
			case durationType:
				
				buildModalForChangeConfirmation("Confirm Change", "Changing the event duration will remove ALL EXISTING EVENT SLOTS and USERS tied to this event.");
				
				$('#generalConfirm').modal('toggle');
				
				$('#generalAcceptButton').on('click', function() {
					changedDuration();
					$('#existingEventsTable tbody').empty();
					stateOfEvent.slots = [];
					$('#generalConfirm').modal('toggle');
					stateOfEvent.duration = $("#durationSelector option:selected");
				});

				break;
				
			default:
				clearModal();
				return;
		};
	}
	else
		return;
	
}

$('#fileUpload').on('click', function(e) {
	e.preventDefault();
	callCheckConfirmation(fileUploadType);
});

$('#anonymousCheck').on('click', function(e) {
	e.preventDefault();
	callCheckConfirmation(anonymousCheckType);
});

$('#timeslotCapInput').on('change', function(e) {
	callCheckConfirmation(capacityType);
});

$('#durationSelector').on('change', function(e) {
	callCheckConfirmation(durationType);
});

function changedDuration() {
	
	$('.removeOnClear').remove(); // Clear all add cells
	$('#datepicker').datepicker('update', ''); // clear all add dates

	var selectedDuration = parseInt($('#durationSelector').find(":selected").val(), 10);

	var offset = 0;
	var minutes = 0;
	var hourInMinutes = 60;
	var totalHours = 12;

	switch (selectedDuration) {

		case 15:

			var durationOffset = 4;
			var durationSlots = 3;
			var minutesIncrement = 15;
			break;

		case 30:

			var durationOffset = 2;
			var durationSlots = 1;
			var minutesIncrement = 30;
			break;

		case 60:

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
}

function buildModalForSave(modalHeaderName) {
	$('#generalHeaderLabel').text(modalHeaderName);
	
	var newEventName = $('#eventNameInput').val();
	var newEventLocation = $('#locationInput').val();
	var newEventDescript = $('#eventDescriptTextArea').val();
	var newEventSlot = $('#timeslotCapInput').val();
	var newEventAnonymousCheck = $('#anonymousCheck').prop('checked');
	var newEventFileOption = $('#fileUpload').prop('checked');

	var eventSaveVals = [];
	
	eventSaveVals.push(["Event Name", newEventName]);
	eventSaveVals.push(["Event Location", newEventLocation]);
	eventSaveVals.push([EVENT_DESCRIPT_LIST_LABEL, newEventDescript]);
	eventSaveVals.push(["Event Slot Capacity", newEventSlot]);
	eventSaveVals.push(["Event Anonymous Option", newEventAnonymousCheck]);	
	eventSaveVals.push(["Event File Option", newEventFileOption]);
	
	var list = $('<ul></ul>');
	list.addClass('list-group saveItemList');
	$('.confirmationDescriptionContainer').append(list);
	
	for(let i = 0; i < eventSaveVals.length; i++)
	{
		if (typeof eventSaveVals[i][1] === "boolean"){
			
			if (eventSaveVals[i][1] === false)
			{
				var offLabel = $('<text>OFF</text>');
				offLabel.addClass('offLabel');
				var changeItem = $('<li><label>'+eventSaveVals[i][0]+':</label> </li>');
				changeItem.append(offLabel);
			}
			else if (eventSaveVals[i][1] === true) 
			{
				var onLabel = $('<text>ON</text>');
				onLabel.addClass('onLabel');
				var changeItem = $('<li><label>'+eventSaveVals[i][0]+':</label> </li>');
				changeItem.append(onLabel);
			}
		}
		else if (eventSaveVals[i][1] === "")
		{
			if (eventSaveVals[i][0] === EVENT_DESCRIPT_LIST_LABEL)
				var changeItem = $('<li><label>'+eventSaveVals[i][0] +':</label> No Description</li>');
			else
				var changeItem = $('<li><label>'+eventSaveVals[i][0] +':</label> Unchanged</li>');
		}
		else
		{
			var itemValue = $('<text>'+eventSaveVals[i][1]+'</text>');
			itemValue.addClass('changedLabel');
			var changeItem = $('<li><label>'+eventSaveVals[i][0] +':</label> </li>');
			changeItem.append(itemValue);
		}
		changeItem.addClass('list-group-item');
		$('.confirmationDescriptionContainer ul').append(changeItem);
	}		
}

function saveFormChanges() {

	var newEventName = $('#eventNameInput').val();
	var newEventLocation = $('#locationInput').val();
	var newEventDescript = $('#eventDescriptTextArea').val();
	var newEventSlot = $('#timeslotCapInput').val();
	var newEventFileOption = $('#fileUpload').prop('checked');
	var newEventAnonymousCheck = $('#anonymousCheck').prop('checked');

	var eventSaveVals = [];
	
	eventSaveVals.push(newEventName);
	eventSaveVals.push(newEventLocation);
	eventSaveVals.push(newEventDescript);
	eventSaveVals.push(newEventSlot);
	eventSaveVals.push(newEventFileOption);
	eventSaveVals.push(newEventAnonymousCheck);
	
	for (let i = 0; i < eventSaveVals.length; i++)
		console.log(eventSaveVals[i]);

}

$('#saveForm').on('click', function() {
	
	buildModalForSave("Confirm Save");
	$('#generalConfirm').modal('toggle');
	
	$('#generalAcceptButton').on('click', function() {
		saveFormChanges();
		$('#generalConfirm').modal('toggle');
	});
				
	$('#generalCancelButton').on('click', function() {
		$('#generalConfirm').modal('toggle');
	});
	
	
});

$('#openAddEvents').on('click', function() {
	$('#addEventModal').modal('toggle');
	$('#datepicker').datepicker('update', ''); // clear all dates
	changedDuration(); // update the add cells
});

$('#addEventModal').on('hidden.bs.modal', function () {
	$('#datepicker').datepicker('update', ''); // clear all dates
	$('.removeOnClear').remove(); //Clear all cells
});

//source: https://truetocode.com/check-for-duplicates-in-array-of-javascript-objects/
function arraysNoDuplicate(superset, subset) {

    if (!Array.isArray(superset) || ! Array.isArray(subset))
      return false;
	
	let set1 =  superset.map((value)=>{
		return value.startDate;
	});
	
	let set2 = subset.map((value)=>{
		return value.startDate;
	});
	
	let createSet  = new Set(set1.concat(set2));  // Creating a set will remove all duplicate start Dates
	
	let unionSet = set1.concat(set2);

	if (createSet.size < unionSet.length)  // Duplicate detected a removed. Therefore there are duplicates
		return false;
	else
		return true;

}

$('#addEventsButton').on('click', function() {
	var addEventsCheck = addEventSlots();
	
	if (addEventsCheck === false || $('#Dates').val() == "")  //addEventsCheck is false when incorrect information is passed. Otherwise it is the slots from adding.
		alert("Must have an inputted date before adding!");
	else
	{
		if (arraysNoDuplicate(stateOfEvent.slots, addEventsCheck) === true)
		{
			for (let i = 0; i < addEventsCheck.length; i++)
				stateOfEvent.slots.push(addEventsCheck[i]);
			
			addToExistingEvent(addEventsCheck);
			$('#addEventModal').modal('toggle');
		
		}
		else
			alert("Duplication event slot detected");
	}
});


function appendToExistingEventTable(date, nameOfDay, startTime, endTime) {
	var newRow = $('<tr></tr>');
	
	var eventDate = $('<td>'+date+'</td>');
	eventDate.addClass('editableField');
	eventDate.on("click", function() {
		console.log("Event Date Update");
	});
	
	var eventDayName = $('<td>'+nameOfDay+'</td>');
	
	var eventStartTime = $('<td>'+startTime+'</td>');
	eventStartTime.addClass('editableField');
	eventStartTime.on("click", function() {
		console.log("Event Start Time Update");
	});
	
	var eventEndTime = $('<td>'+endTime+'</td>');
	
	var deleteOptionCell = $('<td></td>');
	var massDeleteOption = $('<input></input>');
	massDeleteOption.attr("type", "checkbox");
	massDeleteOption.attr("unchecked");
	
	if (!($('.deleteSelectButton').hasClass('toggled')))
		massDeleteOption.addClass("doNotDisplay");
	massDeleteOption.addClass("massDeleteOn");
	
	var deleteButton = $('<button></button>');
	if (($('.deleteSelectButton').hasClass('toggled')))
		deleteButton.addClass("doNotDisplay");
	deleteButton.addClass("eventManageButton deleteEvent");
	
	var deleteIcon = $('<i></i>');
	deleteIcon.addClass("fas fa-times");
	
	var deleteText = $('<text> Delete</text>');
	
	deleteButton.append(deleteIcon);
	deleteButton.append(deleteText);
	
	deleteButton.on("click", function() {
		deleteSelectedEvent($(this));
	});
	
	deleteOptionCell.append(massDeleteOption);
	deleteOptionCell.append(deleteButton);
	
	newRow.append(eventDate);
	newRow.append(eventDayName);
	newRow.append(eventStartTime);
	newRow.append(eventEndTime);
	newRow.append(deleteOptionCell);
	
	$('#existingEventsTable tbody').append(newRow);
	
}


function addToExistingEvent(newSlots) {
	
	console.log(newSlots);
	for (let i = 0; i < newSlots.length; i++) {
		var timeInfo = newSlots[i].startDate.split(' ');
		var endTimeInfo = newSlots[i].endDate.split(' ');
		
		var dateValue = timeInfo[0];
		var timeValue = timeInfo[1];
		
		var datePieces = dateValue.split("-");
		
		datePieces[2] = datePieces[2]; //Remove leading 0's by casting to integer
		var month = datePieces[1]; // save month to get correct month and day
		datePieces[1] = datePieces[1] - 1; //day name for object month is off by 1;
		
		var dateObj = new Date(datePieces[0], datePieces[1], datePieces[2]);
		var nameOfDay = getDayName(dateObj);
		
		
		// Values passed in format: mm/dd/yyyy, nameOfDay (e.g. Tuesday), start time (hh:mm AM/PM) - endTime (hh:mm AM/PM)
		appendToExistingEventTable(month + "/" + datePieces[2] + "/" + datePieces[0], nameOfDay, convertMilitaryTimeToAMPM(timeValue), convertMilitaryTimeToAMPM(endTimeInfo[1]));
	}
	
}

//Military Time to 12 Hour AM/PM
function convertMilitaryTimeToAMPM(timeInMilitaryFormat) {
   
    var timeVal = timeInMilitaryFormat.split(":");
	
	var hours = parseInt(timeVal[0],10) > 12 ? parseInt(timeVal[0],10) - 12 : parseInt(timeVal[0],10);
	var AM_PM = parseInt(timeVal[0],10) >= 12 ? "PM" : "AM";
	hours = hours < 10 ? hours : hours;
	var minutes = parseInt(timeVal[1],10) < 10 ? "0" + parseInt(timeVal[1],10) : parseInt(timeVal[1],10);

	time = hours + ":" + minutes + " " + AM_PM;
	return time;

};

// source: https://stackoverflow.com/questions/15083548/convert-12-hour-hhmm-am-pm-to-24-hour-hhmm
function convertAMPMToMilitary(timeInAMPM) {
	var time = timeInAMPM;
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if(AMPM == "PM" && hours<12) hours = hours+12;
	if(AMPM == "AM" && hours==12) hours = hours-12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if(hours<10) sHours = sHours;
	if(minutes<10) sMinutes = "0" + sMinutes;
	return sHours + ":" + sMinutes;
}

function addEventSlots() {

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