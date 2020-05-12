const EDITTAG = "EDIT";
const CHANGEDDURATIONTAG = "CHANGED DURATION";
const EVENT_DESCRIPT_LIST_LABEL = "EVENT_DESCRIPTION";
const eventDeleteIndex = 1;
const ADD_TIME_TABLE_ELEMENT = '#timeSelector tr';
const EDIT_TIME_TABLE_ELEMENT = '#editTimeSelector tr';
const existingEventsArray = []; // this will be changed to existing events from Database. Initially this will be empty and it will be loaded from the init function
const dbSlots = [];

const stateOfEvent = {
	name: "",
	capacity: "",
	duration: "",	// tracks the previous duration of the state
	dbDuration: "",	// duration from the DB. Only gets updated on Init/Save
	dbCapacity: "",	// capacity from the DB. Only gets updated on Init/Save
	addedSlots: [],
	dbSlots: [] // save the snapshot of the DB's existing slot. Only changes on init/save
};

const disabledStack = [];  // This will hold arrays of objects with a snapshot of what changes were made at that instance of an edit

const weekday = new Array(7);

weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


// Returns week day name of a date obj
function getDayName(dateObj) {
	var dayOfWeek = weekday[dateObj.getUTCDay()];
	return dayOfWeek;
}

function resetTheState() {

	$('#addEventsTable tbody').empty();

	$('.disabledRow').each(function() {
		$('.disabledRow input[type=checkbox]').prop("checked", false);
		$('.disabledRow input[type=checkbox]').off();
		$(this).removeClass("disabledRow");
	});

	while (disabledStack.length > 0)
		disabledStack.pop();

	stateOfEvent.addedSlots = [];

}

$(document).ready(function () {

	getDataFromDB();
	initTimeState();
	changedDuration(ADD_TIME_TABLE_ELEMENT); // update the time selection cells when adding a time slot
	changedDuration(EDIT_TIME_TABLE_ELEMENT); // update the time selection cells when editing a time slot
	
	updateEditSlotTimeTable();

});

function getDataFromDB() {
	var timeSlotObjects = [];

	var rawEntries = document.getElementsByClassName('eventDataEntry');

	for (var entry of rawEntries) {
		var parsedEntry = JSON.parse(entry.innerText);
		timeSlotObjects.push(parsedEntry);
	}

	while (rawEntries.length > 0) rawEntries[0].remove();

	while (dbSlots.length > 0)
		dbSlots.pop();

	for (let i = 0; i < timeSlotObjects.length; i++)
	{
		dbSlots.push(timeSlotObjects[i]);
	}

	for (let i = 0; i < dbSlots.length; i++) {		// Remove the seconds field off start and end time (i.e :00)
		dbSlots[i].startTime = dbSlots[i].startTime.substring(0, dbSlots[i].startTime.length-3);
		dbSlots[i].endTime   = dbSlots[i].endTime.substring(0, dbSlots[i].endTime.length-3);
	}

	console.log(dbSlots);
}

function initTimeState() {

	var dbExistingSlots = dbSlots;

	var dbDuration = dbExistingSlots[0]['duration'];
	var dbCapacity = dbExistingSlots[0]['capacity'];
	var dbEventName = dbExistingSlots[0]['name'];

	stateOfEvent.name = dbEventName;
	stateOfEvent.dbDuration = dbDuration; //snapshot of duration from DB
	stateOfEvent.duration = dbDuration;	//track previous duration
	stateOfEvent.capacity = dbCapacity;
	stateOfEvent.dbCapacity = dbCapacity;

	$("#durationSelector").val(dbDuration);
	$("#timeslotCapInput").val(dbCapacity);

	$('#existingEventsTable tbody').empty();

	while (existingEventsArray.length > 0)
		existingEventsArray.pop();

	stateOfEvent.dbSlots = [];

	for (let i = 0; i < dbExistingSlots.length; i++) {
		stateOfEvent.dbSlots.push(dbExistingSlots[i]);
		existingEventsArray.push(dbExistingSlots[i]);
		var dbObjToReadable = databaseDateFormatToReadable(dbExistingSlots[i]);
		appendToExistingEventTable(dbObjToReadable.date, dbObjToReadable.dayName, dbObjToReadable.startTime, dbObjToReadable.endTime);
	}

	//console.log(existingEventsArray);

}

function buildModalForMoveSlots(editRow) {

	var slotInfo = getEventInFormatFromTableCells(editRow)
	$('#editSlotName').text(slotInfo.displayValue);

	slotPieces = slotInfo.startTime.split(" ");

	var currentDate = new Date();
	var dateWithSlash = slotPieces[0].replace(/-/g, '/')
	var slotDate = new Date(dateWithSlash);

	$("#editDatepicker").datepicker("setDate", slotDate);
	$("#editDatepicker").datepicker("defaultDate", slotDate );


	$("#editTimeSelector tr").not(':first').not(':last').each(function () {

		var time = formatTime($(this).children().find('div').text());

		if (time == slotPieces[1])
		{
			$(this).children().last().addClass("fullSlot");
		}
	});

}

function createDisabledInstance(arrayToMoveFrom, toBeRemovedSlots, newSlots, tag) {

	var temp_existing = arrayToMoveFrom;

	for (let i = 0; i < toBeRemovedSlots.length; i++) {
		for (let j = 0; j < temp_existing.length; j++) {
			if (temp_existing[j].startTime == toBeRemovedSlots[i].startTime) {
				temp_existing.splice(j, 1);
			}
		}
	}

	if (arraysNoDuplicate(temp_existing, newSlots) == true) {
		arrayToMoveFrom = temp_existing;
		var disabledInstance = {
			nameOfChange: tag,
			addedSlots: newSlots,
			disabledSlots: toBeRemovedSlots
		};
		disabledStack.push(disabledInstance);
		//console.log(disabledStack);
		//console.log(arrayToMoveFrom);
		return true;
	}
	else
		return false;

}

function editSlot(datesToBeMoved, toBeMovedRow) {
		var newSlotDate = $('#editDates').val();
		var hasSelected = false;
		var startTime = null;
		var endTime = null;

		$("#editTimeSelector tr").not(':first').not(':last').each(function () {

			if ($(this).children().last().hasClass("selected"))
			{
				startTime = $(this).children().find('div').text();
			}

			if ($(this).children().last().hasClass("fullSlot"))
			{
				hasSelected = $(this).children().find('div').text();
			}
		});

		if (startTime == null)
			startTime = hasSelected;

		endTime = formatTime(parseInt(startTime,10) + parseInt(stateOfEvent.duration, 10));
		startTime = formatTime(startTime);


		var datePieces = newSlotDate.split('/');
		var dateInDbFormat = datePieces[2] + "-"+ datePieces[0] + "-" + datePieces[1];

		var newEditSlotObj = {
								startTime: dateInDbFormat + " " + startTime,
								endTime: dateInDbFormat + " " + endTime
							 };

		var newSlots = [];
		newSlots.push(newEditSlotObj);
		var tempAllSlots = existingEventsArray.concat(stateOfEvent.addedSlots);

		if (arraysNoDuplicate(tempAllSlots, newSlots) == true) {

			if (createDisabledInstance(existingEventsArray, datesToBeMoved, newSlots, EDITTAG) == true) {

					toBeMovedRow.addClass("disabledRow");
					toBeMovedRow.removeClass("selectedRow");
					$('.disabledRow input[type=checkbox]').prop("checked", true);
					$('.disabledRow input[type=checkbox]').on("click", function (e) {
						e.preventDefault();
					});

					stateOfEvent.addedSlots.push(newSlots[0]);
					var formattedTime = databaseDateFormatToReadable(newSlots[0]);

					// Values passed in format: mm/dd/yyyy, nameOfDay (e.g. Tuesday), start time (hh:mm AM/PM) - endTime (hh:mm AM/PM)
					appendToAddedTable(formattedTime.date, formattedTime.dayName, formattedTime.startTime, formattedTime.endTime);
			}

			$('#editSlotsModal').modal('toggle');
		}
		else
		{
			return false;
		}
}

$('#editExistingSlots').on('click', function () {

	$('#editSlotsConfirmButton').off();
	$('#editSlotsCancelButton').off();

	var toBeMovedRow = null;

	$('#existingEventsTable tbody tr').each(function () {
		if ($(this).hasClass("selectedRow"))
			toBeMovedRow = $(this);
	});

	if (toBeMovedRow === null) {
		alert("No Existing Slot(s) selected");
		return;
	}

	var datesToBeMoved = [];

	var moveInfoObj = getEventInFormatFromTableCells(toBeMovedRow)
	datesToBeMoved.push(moveInfoObj);

	changedDuration(EDIT_TIME_TABLE_ELEMENT); // update the add cells
	updateEditSlotTimeTable();
	buildModalForMoveSlots(toBeMovedRow);
	$('#editSlotsModal').modal('toggle');

	$('#editSlotsConfirmButton').on('click', function () {

		if (editSlot(datesToBeMoved, toBeMovedRow) == false) {
			alert("duplicate slot detected");
		}
		else
		{
			$('#editSlotsModal').modal('toggle');
		}
	});

	$('#editSlotsCancelButton').on('click', function () {
		$('#editSlotsModal').modal('toggle');
	});

});

function appendToExistingEventTable(date, nameOfDay, startTime, endTime) {
	var newRow = $('<tr></tr>');
	newRow.addClass('editableField');

	newRow.on("click", function () {
		$(".selectedRow").each(function() {
			$(this).removeClass("selectedRow");
		});

		$(this).toggleClass("selectedRow");
	});

	newRow.on("click", 'td:last-child', function (e) {
		e.stopPropagation();
	});

	var eventDate = $('<td>' + date + '</td>');

	var eventDayName = $('<td>' + nameOfDay + '</td>');

	var eventStartTime = $('<td>' + startTime + '</td>');

	var eventEndTime = $('<td>' + endTime + '</td>');

	var deleteOptionCell = $('<td></td>');
	var checkedForDelete = $('<input></input>');
	checkedForDelete.attr("type", "checkbox");
	checkedForDelete.attr("unchecked");
	checkedForDelete.addClass("checkedForDelete");
	deleteOptionCell.append(checkedForDelete);

	newRow.append(eventDate);
	newRow.append(eventDayName);
	newRow.append(eventStartTime);
	newRow.append(eventEndTime);
	newRow.append(deleteOptionCell);

	$('#existingEventsTable tbody').append(newRow);

}

$('#hideExistingDates').on("click", function () {
	$(this).toggleClass('buttonActive');
	$('#existingEventsTable').toggleClass("doNotDisplay");
});

$('#hideAddedDates').on("click", function () {
	$(this).toggleClass('buttonActive');
	$('#addEventsTable').toggleClass("doNotDisplay");
});


// Source: https://jsfiddle.net/christianklemp_imt/b20paum2/

$(document).ready(function () {


	// Date picker for edit slots
	$('#editDatepicker').datepicker({
		startDate: new Date(),
		multidate: false,
		format: "mm/dd/yyyy",
		language: 'en'
	})


	// Date picker for add slots
	$('#datepicker').datepicker({

		startDate: new Date(),
		multidate: true,
		minDate: 0,
		format: "mm/dd/yyyy",
		language: 'en'

	}).on('changeDate', function (e) {

		dragTable(); // Add event handler

		// `e` here contains the extra attributes

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

	$("#timeSelector tr").not(':first').not(':last').each(function () {

		var time = formatTime($(this).children().find('div').text());

		var date = formatDate(newDateHeader.text());
		var startValCheckForDupe = [{
			startTime: (date + " " + time),
			endTime: null
		}];

		var allSlotsTempArray = existingEventsArray.concat(stateOfEvent.addedSlots);

	//	console.log(allSlotsTempArray);
		//console.log(startValCheckForDupe);

		if (arraysNoDuplicate(allSlotsTempArray, startValCheckForDupe) == false)
			$(this).children().last().addClass("fullSlot");

	});

}

function formatDate(currDate) {
	var year = currDate.substr(-4);
	var month = currDate.slice(0, 2);
	var day = currDate.slice(3, 5);
	var newDate = year + "-" + month + "-" + day;
	return newDate;
}



function formatTime(temp) {
	var totalMinutes = parseInt(temp, 10);
	var startHour = 7;
	var hours = startHour + Math.floor(totalMinutes / 60);
	var minutes = totalMinutes % 60;
	if (minutes == 0) {
		if (parseInt(hours,10) < 10)
			hours = "0" + hours;
		return hours + ":" + minutes + "0";
	}
	if (parseInt(hours,10) < 10)
		hours = "0" + hours;
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

function getEventInFormatFromTableCells(tableRow) {
	var formattedEventString = [];

	tableRow.find('td').not(':last').each(function () {
		formattedEventString.push($(this).text());
	});

	var yyyy_mm_dd_format = formatDate(formattedEventString[0]);

	var formatStringObj = {
		displayValue: formattedEventString[0] + ", " + formattedEventString[1] + ", " + formattedEventString[2] + " - " + formattedEventString[3],
		startTime: yyyy_mm_dd_format + " " + convertAMPMToMilitary(formattedEventString[2]),
		endTime: yyyy_mm_dd_format + " " + convertAMPMToMilitary(formattedEventString[3])
	}

	return formatStringObj;
}


function updateStateFromDelete(startTimeValToBeRemoved) {

	console.log(startTimeValToBeRemoved);
	for (let i = 0; i < stateOfEvent.addedSlots.length; i++) {
		if (stateOfEvent.addedSlots[i].startTime == startTimeValToBeRemoved) {
			stateOfEvent.addedSlots.splice(i, 1);
		}
	}
}


//Deletes slots cached in the added slots state array
function deleteAddSlots(arrayWithReadyToDeleteEventRows) {

	var arrayOfEventSlotsToDelete = [];

	console.log(arrayWithReadyToDeleteEventRows);
	
	arrayWithReadyToDeleteEventRows.forEach(number => {
		var deleteObjInfo = getEventInFormatFromTableCells(number);
		arrayOfEventSlotsToDelete.push(deleteObjInfo.startTime);
	});

	for (let i = 0; i < arrayOfEventSlotsToDelete.length; i++) {
		updateStateFromDelete(arrayOfEventSlotsToDelete[i]);
		arrayWithReadyToDeleteEventRows[i].remove();
	}
}

function removeAddSlotFromTable(deleteButton) {
	
	var tempHolder = [];
	tempHolder.push(deleteButton.parent().parent());
	deleteAddSlots(tempHolder);
}



function resetCanceledInput() {

	var findSelectedDuration = $('#durationSelector').find(":selected");

	if (stateOfEvent.duration != findSelectedDuration.val())
		$('#durationSelector').find('option[value="' + stateOfEvent.duration + '"]').prop('selected', 'selected');

	if (stateOfEvent.capacity != $('#timeslotCapInput').val())
		$('#timeslotCapInput').val(stateOfEvent.dbCapacity);
}


$('#timeslotCapInput').on('change', function (e) {
	
	if (stateOfEvent.dbCapacity < $('#timeslotCapInput').val())
	{
		stateOfEvent.capacity = $('#timeslotCapInput').val();
	}
	else
	{
		buildModalForChangeConfirmation("Confirm Change", "Saving a time slot capacity less than the current capacity will only apply to slots with enough space to be decremented. Time slots with users booked to that slot that EXCEEDS the new capacity will retain it's original size. ");

		$('#generalConfirm').modal('toggle');

		$('#generalAcceptButton').on('click', function () {
			$('#generalConfirm').modal('toggle');
			stateOfEvent.capacity = $('#timeslotCapInput').val();
		});
	}
});

$('#durationSelector').on('change', function (e) {
	buildModalForChangeConfirmation("Confirm Change", "Saving a change to the event duration will remove ALL EXISTING EVENT SLOTS and USERS tied to this event.");

				$('#generalConfirm').modal('toggle');

				$('#generalAcceptButton').on('click', function () {

					resetTheState();

					if (parseInt($("#durationSelector option:selected").val(), 10) === parseInt((stateOfEvent.dbDuration), 10)) {
						$('.disabledRow').each(function () {
							$(this).removeClass("disabledRow");
							$('.disabledRow input[type=checkbox]').prop("checked", false);
							$('.disabledRow input[type=checkbox]').off();
						});

						$('#existingEventsTable tbody').empty();
						while (existingEventsArray.length > 0)
							existingEventsArray.pop();

						for (let i = 0; i < stateOfEvent.dbSlots.length; i++)
							existingEventsArray.push(stateOfEvent.dbSlots[i]);

						for (let i = 0; i < existingEventsArray.length; i++) {
							var dbObjToReadable = databaseDateFormatToReadable(existingEventsArray[i]);
							appendToExistingEventTable(dbObjToReadable.date, dbObjToReadable.dayName, dbObjToReadable.startTime, dbObjToReadable.endTime);
						}
					}
					else {
						var tempDisabledExistingEvents = [];
						$('#existingEventsTable tbody tr').each(function () {
							$(this).addClass("disabledRow");
							$(this).removeClass("selectedRow");
							tempDisabledExistingEvents.push(getEventInFormatFromTableCells($(this)));
							$('.disabledRow input[type=checkbox]').prop("checked", true);
							$('.disabledRow input[type=checkbox]').on("click", function (e) {
								e.preventDefault();
							});
						});
						createDisabledInstance(existingEventsArray, tempDisabledExistingEvents, [], CHANGEDDURATIONTAG);
					}


					changedDuration(ADD_TIME_TABLE_ELEMENT);
					changedDuration(EDIT_TIME_TABLE_ELEMENT);
					updateEditSlotTimeTable();

					console.log(stateOfEvent.addedSlots);
					console.log(existingEventsArray);
					console.log(disabledStack);

					$('#generalConfirm').modal('toggle');
					stateOfEvent.duration = $("#durationSelector option:selected").val();
				});
});


function updateEditSlotTimeTable() {

	$('.removeEditOnClear').remove(); // Clear all edit cells
	var editSlotTimeTableText = $('<label> Edit Slot Time: </label>');
	editSlotTimeTableText.addClass('removeEditOnClear');
	$("#editTimeSelector tr:first").append(editSlotTimeTableText);
	var newDateColumn = $('<td></td>');
	newDateColumn.addClass("removeEditOnClear");
	$("#editTimeSelector tr").not(':first').not(':last').append(newDateColumn);

	$("#editTimeSelector tr td").each(function() {
		$(this).on("click", function() {

			$(".selected").each(function() {
				$(this).removeClass("selected");
			});

			$(this).toggleClass("selected");
		});
	});
}

// Parameter is the table with built in time slots to change. Applies to edit and add feature
function changedDuration(timeTablePickerSelectorID) {

	$('.removeOnClear').remove(); // Clear all add cells
	//$('#datepicker').datepicker('update', ''); // clear all add dates

	var selectedDuration = parseInt($('#durationSelector').find(":selected").val(), 10);

	console.log(timeTablePickerSelectorID);

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
			$(timeTablePickerSelectorID).eq(offset + j + 1).after(newRow);

		}

		minutes = (hourInMinutes * (i + 1));
		offset = offset + durationOffset;

	}

}


function buildModalForTimeSave(modalHeaderName, addArray, deleteArray, newDuration, newCapacity) {
	$('#generalHeaderLabel').text(modalHeaderName);

	var durationContainerField = $('<div></div>');
	var durationField = $('<label>Duration: </label>');

	var capacityContainerField = $('<div></div>');
	var capacityField = $('<label>Capacity: </label>');

	var durationText = $('<text> '+newDuration+' Minutes </text>');
	var capacityText = $('<text> '+newCapacity+' </text>');

	var warningLabel = $('<label>*WARNING!*</label>');
	warningLabel.addClass('warning offLabel');

	var warningLabel2 = $('<label>*WARNING!*</label>');
	warningLabel2.addClass('warning offLabel');

	if (newDuration == stateOfEvent.dbDuration)
		durationText.append(" (Unchanged)");
	else
	{
		durationContainerField.append(warningLabel);
		durationContainerField.append('<br>');
		durationContainerField.append("<text>Saving this change will remove all users off the event!</text>");
		durationText.addClass('onLabel');
	}

	if (newCapacity == stateOfEvent.dbCapacity)
		capacityText.append(" (Unchanged)");
	else
	{
		if (newCapacity < stateOfEvent.dbCapacity)
		{
			capacityContainerField.append(warningLabel2);
			capacityContainerField.append('<br>');
			capacityContainerField.append("<text>Saving this change may remove users off an existing slot!</text>");
		}
		capacityText.addClass('onLabel');
	}
	durationField.append(durationText);
	durationContainerField.append(durationField);

	capacityField.append(capacityText);
	capacityContainerField.append(capacityField);

	$('.confirmationDescriptionContainer').append(durationContainerField);
	$('.confirmationDescriptionContainer').append('<br>');
	$('.confirmationDescriptionContainer').append(capacityContainerField);
	$('.confirmationDescriptionContainer').append('<br>');


	$('.confirmationDescriptionContainer').append('<br><br>');

	if (addArray.length > 0) {
		var toBeAdded = $('<div></div>');
		var toBeAddLabel = $('<label> Slots to be ADDED: </label>');
		toBeAdded.append(toBeAddLabel);

		var addList = $('<ul></ul>');
		addList.addClass('list-group saveItemList');

		for (let i = 0; i < addArray.length; i++) {
			var slotInfo = databaseDateFormatToReadable(addArray[i]);
			var listItem = $('<li>' + slotInfo.date + ' , ' + slotInfo.dayName + '  , ' + slotInfo.startTime + ' - ' + slotInfo.endTime + ' </li>');
			listItem.addClass('list-group-item toBeAddedSlots');
			addList.append(listItem);
		}
		toBeAdded.append(addList);
		$('.confirmationDescriptionContainer').append(toBeAdded);
		$('.confirmationDescriptionContainer').append('<br><br>');
	}

	if (deleteArray.length > 0) {
		var toBeDeleted = $('<div></div>');
		var toBeDeletedLabel = $('<label> Slots to be DELETED: </label>');
		var deleteList = $('<ul></ul>');
		deleteList.addClass('list-group saveItemList');
		toBeDeleted.append(toBeDeletedLabel);

		var deleteObjInfoHolder = [];

		for (let i = 0; i < deleteArray.length; i++) {
			var listItem = $('<li>' + deleteArray[i].displayValue + ' </li>');
			listItem.addClass('list-group-item toBeDeletedSlots');
			deleteList.append(listItem);
		}

		toBeDeleted.append(deleteList);
		$('.confirmationDescriptionContainer').append(toBeDeleted);
		$('.confirmationDescriptionContainer').append('<br><br>');
	}

}


function getExistingEventsFromDBCachedSlots(deleteDatesArray) {

	var eventSlotsFromCacheToBeDeleted = [];

	for (let i = 0; i < deleteDatesArray.length; i++) {

		for (let j = 0; j < dbSlots.length; j++)
		{
			if (deleteDatesArray[i].startTime == dbSlots[j].startTime)
				eventSlotsFromCacheToBeDeleted.push(dbSlots[j]);
		}
	}
	//console.log(eventSlotsFromCacheToBeDeleted);
	//console.log(deleteDatesArray);
	//console.log(dbSlots);
	return eventSlotsFromCacheToBeDeleted;
}

function saveTimeChanges(eventAddArray, eventDeleteArray, eventNewDuration, eventNewCapacity) {

	console.log(eventNewDuration);
	console.log(eventNewCapacity);
	// Make Save Time AJAX call here
	//console.log(window.location.search.split('?key=')[1]);
	var newAddArray = JSON.stringify(eventAddArray);
	var newDeleteArray = JSON.stringify(eventDeleteArray);
	$.ajax({
		type: "POST",
		url: "edit_event.php",
		data: {
			eventHash: window.location.search.split('?key=')[1],
			addedSlots: newAddArray,
			deletedSlots: newDeleteArray,
			slot_duration: eventNewDuration,
			slot_capacity: eventNewCapacity
		}
	}).done(function(response) {
		alert(response);
	});
	console.log("ADDED SLOTS:")
	console.log(eventAddArray);
	console.log("DELETED SLOTS:")
	console.log(eventDeleteArray);
}

$('#saveSlots').on('click', function () {

	var deleteObjInfoHolder = [];

	//console.log(disabledStack);
	$("#existingEventsTable tr td:nth-last-child( " + eventDeleteIndex + " )").each(function () {
		if (!$(this).parent().hasClass("disabledRow") && $(this).children().prop("checked")) {
			var deleteObjInfo = getEventInFormatFromTableCells($(this).parent());
			deleteObjInfoHolder.push(deleteObjInfo);
		}
	});

	for (let i = 0; i < disabledStack.length; i++)	// Get the disabled slots back into the delete array
		deleteObjInfoHolder = deleteObjInfoHolder.concat(disabledStack[i].disabledSlots);

	console.log(stateOfEvent.capacity);
	console.log(stateOfEvent.dbCapacity);
	if (deleteObjInfoHolder.length < 1 && stateOfEvent.addedSlots < 1 && stateOfEvent.capacity == stateOfEvent.dbCapacity)
	{
		alert("No Changes have been made");
		return;
	}

	buildModalForTimeSave("Confirm Save", stateOfEvent.addedSlots, deleteObjInfoHolder, stateOfEvent.duration, stateOfEvent.capacity);
	$('#generalConfirm').modal('toggle');


	$('#generalAcceptButton').one('click', function () {
		saveTimeChanges(stateOfEvent.addedSlots, getExistingEventsFromDBCachedSlots(deleteObjInfoHolder), stateOfEvent.duration, stateOfEvent.capacity);
		$('#generalConfirm').modal('toggle');
		resetTheState();
	});

	$('#generalCancelButton').on('click', function () {
		$('#generalConfirm').modal('toggle');
	});

});


$('#openAddEvents').on('click', function () {
	$('#addEventModal').modal('toggle');
	changedDuration(ADD_TIME_TABLE_ELEMENT); // update the add cells
	//$('#datepicker').datepicker('update', ''); // clear all dates
});

$('#addEventModal').on('hidden.bs.modal', function () {
	//$('#datepicker').datepicker('update', ''); // clear all dates
	$('#datepicker').datepicker('setDate', null);
	$('.removeOnClear').remove(); //Clear all cells
});

//source: https://truetocode.com/check-for-duplicates-in-array-of-javascript-objects/
function arraysNoDuplicate(superset, subset) {


	//console.log(superset);
	//console.log(subset);

	if (!Array.isArray(superset) || !Array.isArray(subset))
		return false;

	let set1 = superset.map((value) => {
		return value.startTime;
	});

	let set2 = subset.map((value) => {
		return value.startTime;
	});

	let createSet = new Set(set1.concat(set2));  // Creating a set will remove all duplicate start Dates

	let unionSet = set1.concat(set2);

	if (createSet.size < unionSet.length)  // Duplicate detected a removed. Therefore there are duplicates
		return false;
	else
		return true;

}

$('#addEventsButton').on('click', function () {
	var addEventsCheck = addEventSlots();

	if (addEventsCheck === false || $('#Dates').val() == "")  //addEventsCheck is false when incorrect information is passed. Otherwise it is the slots from adding.
		alert("Must have an inputted date before adding!");
	else {


		var allSlotsTempArray = existingEventsArray.concat(stateOfEvent.addedSlots);

		if (arraysNoDuplicate(allSlotsTempArray, addEventsCheck) === true) {
			//for (let i = 0; i < addEventsCheck.length; i++)
			stateOfEvent.addedSlots = stateOfEvent.addedSlots.concat(addEventsCheck);

			addToExistingEvent(addEventsCheck);
			$('#addEventModal').modal('toggle');

		}
		else
			alert("Duplication event slot detected");
	}
});

function appendToAddedTable(date, nameOfDay, startTime, endTime) {
	var newRow = $('<tr></tr>');

	var eventDate = $('<td>' + date + '</td>');

	var eventDayName = $('<td>' + nameOfDay + '</td>');

	var eventStartTime = $('<td>' + startTime + '</td>');

	var eventEndTime = $('<td>' + endTime + '</td>');

	var deleteOptionCell = $('<td></td>');

	var deleteIcon = $('<i></i>');
	deleteIcon.addClass("fa fa-times");
	
	var deleteButton = $('<button></button>');
	deleteButton.addClass('deleteAddedSlot');
	deleteButton.append(deleteIcon);
	
	deleteButton.on("click", function() {
		removeAddSlotFromTable($(this));
	});
	
	deleteOptionCell.append(deleteButton);

	newRow.append(eventDate);
	newRow.append(eventDayName);
	newRow.append(eventStartTime);
	newRow.append(eventEndTime);
	newRow.append(deleteOptionCell);

	$('#addEventsTable tbody').append(newRow);

}

// Input takes a object with start date and end Date (Format: yyyy-mm-dd hh:mm)
function databaseDateFormatToReadable(databaseDateObj) {
	var timeInfo = databaseDateObj.startTime.split(' ');
	var endTimeInfo = databaseDateObj.endTime.split(' ');

	var dateValue = timeInfo[0];
	var timeValue = timeInfo[1];

	var datePieces = dateValue.split("-");

	datePieces[2] = datePieces[2]; //Remove leading 0's by casting to integer
	var month = datePieces[1]; // save month to get correct month and day
	datePieces[1] = datePieces[1] - 1; //day name for object month is off by 1;

	var dateObj = new Date(datePieces[0], datePieces[1], datePieces[2]);
	var nameOfDay = getDayName(dateObj);

	return formatedDateObject = {
		date: month + "/" + datePieces[2] + "/" + datePieces[0],
		dayName: nameOfDay,
		startTime: convertMilitaryTimeToAMPM(timeValue),
		endTime: convertMilitaryTimeToAMPM(endTimeInfo[1])
	}
}

function addToExistingEvent(newSlots) {

	//console.log(newSlots);

	for (let i = 0; i < newSlots.length; i++) {
		var formattedTime = databaseDateFormatToReadable(newSlots[i]);

		// Values passed in format: mm/dd/yyyy, nameOfDay (e.g. Tuesday), start time (hh:mm AM/PM) - endTime (hh:mm AM/PM)
		appendToAddedTable(formattedTime.date, formattedTime.dayName, formattedTime.startTime, formattedTime.endTime);
	}

}

//Military Time to 12 Hour AM/PM
function convertMilitaryTimeToAMPM(timeInMilitaryFormat) {

	var timeVal = timeInMilitaryFormat.split(":");

	var hours = parseInt(timeVal[0], 10) > 12 ? parseInt(timeVal[0], 10) - 12 : parseInt(timeVal[0], 10);
	var AM_PM = parseInt(timeVal[0], 10) >= 12 ? "PM" : "AM";
	hours = hours < 10 ? hours : hours;
	var minutes = parseInt(timeVal[1], 10) < 10 ? "0" + parseInt(timeVal[1], 10) : parseInt(timeVal[1], 10);

	time = hours + ":" + minutes + " " + AM_PM;
	return time;

};

// source: https://stackoverflow.com/questions/15083548/convert-12-hour-hhmm-am-pm-to-24-hour-hhmm
function convertAMPMToMilitary(timeInAMPM) {
	var time = timeInAMPM;
	var hours = Number(time.match(/^(\d+)/)[1]);
	var minutes = Number(time.match(/:(\d+)/)[1]);
	var AMPM = time.match(/\s(.*)$/)[1];
	if (AMPM == "PM" && hours < 12) hours = hours + 12;
	if (AMPM == "AM" && hours == 12) hours = hours - 12;
	var sHours = hours.toString();
	var sMinutes = minutes.toString();
	if (hours < 10) sHours = "0" + sHours;
	if (minutes < 10) sMinutes = "0" + sMinutes;
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
						startTime: date + " " + formatTime(currTime),
						endTime: date + " " + formatEndTime(currTime)
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