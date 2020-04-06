const fileUploadType = "FILEUPLOAD";
const anonymousCheckType = "ANONYMOUS";
const capacityType = "CAPACITY";
const durationType = "DURATION";
const EDITTAG = "EDIT";
const CHANGEDDURATIONTAG = "CHANGED DURATION";
const EVENT_DESCRIPT_LIST_LABEL = "EVENT_DESCRIPTION";
const confirmationTypeList = [fileUploadType, anonymousCheckType, capacityType, durationType];
const eventDeleteIndex = 1;

const existingEventsArray = []; // this will be changed to existing events from Database. Initially this will be empty and it will be loaded from the init function

							
const stateOfEvent = {
						name: "",
						eventDate: "",
						eventLocation: "",
						eventDescription: "",
						capacity: "",
						duration: "",	// tracks the previous duration of the state
						dbDuration: "",	// duration from the DB. Only gets updated on Init/Save
						fileOption: false,
						anonymousOption: true,
						addedSlots: [],
						dbSlots: [] // save the snapshot of the DB's existing slot. Only changes on init/save
					 };

const disabledStack = [];  // This will hold arrays of objects with a snapshot of what changes were made at that instance of an edit
					 
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
	
	initFormState();
	initTimeState();
});

function initTimeState() {
	
	var dbDuration = 60;  // Replace these with Duration data from DB
	stateOfEvent.dbDuration = dbDuration;
	$('#existingEventsTable tbody').empty();

	 var dbExistingSlots = [{     // Put DB slots in here
								startDate: "2020-04-14 17:00",
								endDate: "2020-04-14 18:00"
							}, 
							{
								startDate: "2020-04-15 17:00",
								endDate: "2020-04-15 18:00"
							}, 
							{
								startDate: "2020-05-14 17:00",
								endDate: "2020-05-14 18:00"
							}]; 
	
	while (existingEventsArray.length > 0)		
		existingEventsArray.pop();
	
	stateOfEvent.dbSlots = [];
	
	for (let i = 0; i < dbExistingSlots.length; i++)
	{
		stateOfEvent.dbSlots.push(dbExistingSlots[i]);
		existingEventsArray.push(dbExistingSlots[i]);
		var dbObjToReadable = databaseDateFormatToReadable(dbExistingSlots[i]);
		appendToExistingEventTable(dbObjToReadable.date, dbObjToReadable.dayName, dbObjToReadable.startTime, dbObjToReadable.endTime);
		
	}
	console.log(existingEventsArray);
	
	stateOfEvent.duration = dbDuration;
	$("#durationSelector").val(dbDuration);
}

function initFormState() {
	
	var dbEventName = "get Event Name from Database and replace this";
	var dbEventLocation = "Kelly Engineer Center"; // Replace this with val from location in db
	var dbCapacity = 1;   // Replaee This with Capacity Data from DB
	var dbFileOption = false; // Replace this with File option from DB
	var dbAnonymousOption = true; // Replace this with Anonymous option from DB
	var dbEventDescription = "replace this with DB event description";
	
	stateOfEvent.name = dbEventName;
	stateOfEvent.eventLocation = dbEventLocation;
	stateOfEvent.fileOption = dbFileOption;
	stateOfEvent.eventDescription = dbEventDescription;
	stateOfEvent.anonymousOption = dbAnonymousOption;
	stateOfEvent.capacity = $('#timeslotCapInput').val();
	
	$('#eventNameInput').val(dbEventName);
	$('#locationInput').val(dbEventLocation);
	$('#eventDescriptTextArea').val(dbEventDescription);
	$('#timeslotCapInput').val(dbCapacity);
	$('#anonymousCheck').prop("checked", dbAnonymousOption);
	$('#fileUpload').prop("checked", dbFileOption);
}

function buildRadioInput(nameOfLabel, id, nameOfRadio, valueOfRadio) {

	var container = $('<div></div>');
	container.addClass("custom-control custom-radio");
	
	var radioInput = $('<input></input>');
	radioInput.addClass("custom-control-input");
	radioInput.addClass(nameOfRadio);
	radioInput.attr("type", "radio");
	radioInput.attr("id", id);
	radioInput.attr("name", nameOfRadio);
	radioInput.attr("value", valueOfRadio);
	
	var radioLabel = $('<label></label>');
	radioLabel.append(nameOfLabel);
	radioLabel.addClass('custom-control-label');
	radioLabel.attr("for",id);
	
	container.append(radioInput);
	container.append(radioLabel);
	
	return container;
	
}

function buildModalForMoveSlots(modalHeaderName, moveRowArray) {
	$('#generalHeaderLabel').text(modalHeaderName);
	
		var toBeMoved = $('<div></div>');
		var toBeMovedLabel = $('<label> Slots to be MOVED: </label>');
		var moveList = $('<ul></ul>');
		moveList.addClass('list-group saveItemList');
		toBeMoved.append(toBeMovedLabel);
		
		for (let i = 0; i < moveRowArray.length; i++) {
			var listItemInfo = getEventInFormatFromTableCells(moveRowArray[i])
			var listItem = $('<li>'+listItemInfo.displayValue+' </li>');
			listItem.addClass('list-group-item toBeDeletedSlots');
			moveList.append(listItem);
		}
		
		toBeMoved.append(moveList);
		$('.confirmationDescriptionContainer').append(toBeMoved);
		$('.confirmationDescriptionContainer').append('<br><br>');
		
		$('.confirmationDescriptionContainer').append(buildRadioInput("Tomorrow", "radiOneDay", "moveDatesRadio", 1));
		$('.confirmationDescriptionContainer').append(buildRadioInput("Next Week", "radioOneWeek", "moveDatesRadio", 7));
		$('.confirmationDescriptionContainer').append(buildRadioInput("Next Two Weeks", "radioTwoWeeks", "moveDatesRadio", 14));
		
		var datePickerForMove = $('<div></div>');
		datePickerForMove.addClass('input-group date mb-3');
		datePickerForMove.attr("id", "moveDatePicker");
		
		var moveDateInput = $('<input></input>');
		moveDateInput.attr('readonly', true);
		moveDateInput.attr("type", "text");
		moveDateInput.attr("name", "moveDates");
		moveDateInput.attr("id", "moveDateInput");
		moveDateInput.attr("required", "");
		moveDateInput.attr("placeholder", "Enter a Date to Move To");
		moveDateInput.addClass("form-control");
		datePickerForMove.append(moveDateInput);
		
		var calendarWidget = $('<span></span>');
		calendarWidget.addClass("input-group-addon");
		
		var calendarImage = $('<i></i>');
		calendarImage.addClass("glyphicon glyphicon-calendar");
		
		var spanCount = $('<span></span>');
		spanCount.addClass('count');
		
		calendarWidget.append(calendarImage);
		calendarWidget.append(spanCount);
		
		datePickerForMove.append(calendarWidget);
		
		$('.confirmationDescriptionContainer').append(datePickerForMove);
		
		$('#moveDatePicker').datepicker({
			startDate: new Date(),
			multidate: false,
			format: "mm/dd/yyyy",
			daysOfWeekHighlighted: "5,6",
			language: 'en'
		}).on('changeDate', function (e) {
	
			$(".moveDatesRadio").each(function() {
				$(this).prop("checked", false);
			});
		
		});
		
		$('.moveDatesRadio').on("click", function() {
			$('#moveDatePicker').datepicker('update', '');
		});
	
}

function modSlotsByChangeVal(slotsToMod, modValue) {
	
	//console.log(slotsToMod);
	var moddedSlots = [];
	
	if (modValue === -1 && $('#moveDateInput').val() !== "") {
		modValue = $('#moveDateInput').val();
		//console.log(modValue);
		
		for (let i = 0; i < slotsToMod.length; i++)
		{
			var startInfo = slotsToMod[i].startDate.split(" ");
			var endInfo = slotsToMod[i].endDate.split(" ");
			
			var datePieces = modValue.split("/");
			
			var moddedSlot = {
								startDate: datePieces[2] + "-" + datePieces[0] + "-" + datePieces[1] + " " + startInfo[1],
								endDate: datePieces[2] + "-" + datePieces[0] + "-" + datePieces[1] + " " + endInfo[1]
							 };
			moddedSlots.push(moddedSlot);
		}
		return moddedSlots;
		
	}
	else if (modValue !== -1) {
		
		for (let i = 0; i < slotsToMod.length; i++)
		{
			var startInfo = slotsToMod[i].startDate.split(" ");
			var endInfo = slotsToMod[i].endDate.split(" ");
			
			
			var datePieces = startInfo[0].split("-");
			
			var tempDate = new Date(datePieces[0] * 1, datePieces[1] * 1 - 1, datePieces[2] * 1);
			tempDate.setDate(tempDate.getDate() + parseInt(modValue, 10));
			
			var yearPiece = tempDate.getFullYear();
			
			var monthPiece = tempDate.getMonth() + 1;
			if (parseInt(monthPiece,10) < 10)
				monthPiece = '0' + monthPiece;
			
			var dayPiece = tempDate.getDate();
			if (parseInt(dayPiece,10) < 10)
				dayPiece = '0' + dayPiece;
			
			var dateInfo = yearPiece + "-" + monthPiece + "-" + dayPiece;
			
			var moddedSlot = {
								startDate:  dateInfo + " " + startInfo[1],
								endDate:  dateInfo + " " + endInfo[1]
							 };
			moddedSlots.push(moddedSlot);
		}
		//console.log(moddedSlots);
		return moddedSlots;
	
	}
	else
		alert("Something went wrong");
}

function createDisabledInstance(arrayToMoveFrom, toBeRemovedSlots, newSlots, tag) {

	var temp_existing = arrayToMoveFrom;
	
	for (let i = 0; i < toBeRemovedSlots.length; i++)
	{
		for (let j = 0; j < temp_existing.length; j++)
		{
			if (temp_existing[j].startDate == toBeRemovedSlots[i].startDate)
			{
				temp_existing.splice(j,1);
			}
		}
	}

	if (arraysNoDuplicate(temp_existing, newSlots) == true)
	{
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

$('#moveExistingDates').on('click', function() {
	
	var toBeMovedRowArray = [];
	
	$('#existingEventsTable tbody tr').each(function() {
		
		if ($(this).hasClass("selectedRow"))
			toBeMovedRowArray.push($(this));
	});
	
	if (toBeMovedRowArray.length < 1)
	{
		alert("No Existing Slot(s) selected");
		return;
	}
	
	var datesToBeMoved = [];
	
	for (let i = 0; i < toBeMovedRowArray.length; i++) {
		var moveInfoObj = getEventInFormatFromTableCells(toBeMovedRowArray[i])
		datesToBeMoved.push(moveInfoObj);
	}
	
	buildModalForMoveSlots("Move Slots", toBeMovedRowArray);
	
	$('#generalConfirm').modal('toggle');	
	
	
	$('#generalAcceptButton').on('click', function() {
		var modValue = -1;
		
		$(".moveDatesRadio").each(function() {
			if($(this).prop("checked")) {
				modValue = $(this).val();
			}
		});
		
		var newSlots = modSlotsByChangeVal(datesToBeMoved, modValue);
		var tempAllSlots = existingEventsArray.concat(stateOfEvent.addedSlots);
		
		if (arraysNoDuplicate(stateOfEvent.addedSlots, newSlots) == true)
		{
			if (createDisabledInstance(existingEventsArray, datesToBeMoved, newSlots, EDITTAG) == true)
			{
				for (let i = 0; i < newSlots.length; i++) {
					
					toBeMovedRowArray[i].addClass("disabledRow");
					toBeMovedRowArray[i].removeClass("selectedRow");
					$('.disabledRow input[type=checkbox]').prop("checked", true);
					$('.disabledRow input[type=checkbox]').on("click", function(e) {
						e.preventDefault();
					});
					
					
					stateOfEvent.addedSlots.push(newSlots[i]);
					var formattedTime = databaseDateFormatToReadable(newSlots[i]);

					// Values passed in format: mm/dd/yyyy, nameOfDay (e.g. Tuesday), start time (hh:mm AM/PM) - endTime (hh:mm AM/PM)
					appendToAddedTable(formattedTime.date, formattedTime.dayName, formattedTime.startTime, formattedTime.endTime);
				}
				$('#generalConfirm').modal('toggle');
			}
			else
			{
				alert("duplicate detected");
				return;
			}
		}
		else
		{
			alert("There is a slot that conflicts with an existing slot or a slot that is already being added. Edit cannot be made");
			return;
		}
	});
				
	$('#generalCancelButton').on('click', function() {
		$('#generalConfirm').modal('toggle');
	});
	
});
	
function appendToExistingEventTable(date, nameOfDay, startTime, endTime) {
	var newRow = $('<tr></tr>');
	newRow.addClass('editableField');
	
	newRow.on("click", function() {
		$(this).toggleClass("selectedRow");
	});
	
	newRow.on("click", 'td:last-child', function(e) {
		e.stopPropagation();
	});
	
	var eventDate = $('<td>'+date+'</td>');

	var eventDayName = $('<td>'+nameOfDay+'</td>');
	
	var eventStartTime = $('<td>'+startTime+'</td>');
	
	var eventEndTime = $('<td>'+endTime+'</td>');
	
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

$('#hideExistingDates').on("click", function() {
	$(this).toggleClass('buttonActive');
	$('#existingEventsTable').toggleClass("doNotDisplay");
});

$('#hideAddedDates').on("click", function() {
	$(this).toggleClass('buttonActive');
	$('#addEventsTable').toggleClass("doNotDisplay");
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
		
		var allSlotsTempArray = existingEventsArray.concat(stateOfEvent.addedSlots);
		if (arraysNoDuplicate(allSlotsTempArray, startValCheckForDupe) == false)
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
		for(let i=0; i < stateOfEvent.addedSlots.length; i++)
		{
			if(stateOfEvent.addedSlots[i].startDate == startDateValToBeRemoved)
			{	
				stateOfEvent.addedSlots.splice(i, 1);
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

		updateStateFromDelete(deleteObjInfo.startDate);
		$('#deleteConfirm').modal('toggle');
		$('#feedBackModalDelete').modal('toggle');
		//console.log(stateOfEvent.addedSlots);
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
						    startDate: yyyy_mm_dd_format + " " + convertAMPMToMilitary(formattedEventString[2]),
						    endDate: yyyy_mm_dd_format + " " + convertAMPMToMilitary(formattedEventString[3])
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
		arrayOfEventSlotsToDelete.push(deleteObjInfo.startDate);
		var listItem = $('<li> ' + deleteObjInfo.displayValue + ' </li>');
		listItem.addClass('list-group-item');
		$('.containerForEventsToDelete ul').append(listItem);
	});
	
	$('#deleteMassSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
	
		for (let i = 0; i < arrayOfEventSlotsToDelete.length; i++)
		{
			updateStateFromDelete(arrayOfEventSlotsToDelete[i]);
			arrayWithReadyToDeleteEventRows[i].remove();
		}
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

	
	$("#addEventsTable tr td:nth-last-child( " + eventDeleteIndex + " )").each(function () {
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
	
	if (stateOfEvent.duration != findSelectedDuration.val())
		$('#durationSelector').find('option[value="'+ stateOfEvent.duration +'"]').prop('selected', 'selected');

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
					
					resetTheState();
					
					if (parseInt($("#durationSelector option:selected").val(), 10) === parseInt((stateOfEvent.dbDuration),10)) {
						$('.disabledRow').each(function() {
							$(this).removeClass("disabledRow");
							$('.disabledRow input[type=checkbox]').prop("checked", false);
							$('.disabledRow input[type=checkbox]').off();
						});
						
						$('#existingEventsTable tbody').empty();
						while (existingEventsArray.length > 0)		
								existingEventsArray.pop();
						
						for (let i = 0; i < stateOfEvent.dbSlots.length; i++)
							existingEventsArray.push(stateOfEvent.dbSlots[i]);
						
						for (let i = 0; i < existingEventsArray.length; i++)
						{	
							var dbObjToReadable = databaseDateFormatToReadable(existingEventsArray[i]);
							appendToExistingEventTable(dbObjToReadable.date, dbObjToReadable.dayName, dbObjToReadable.startTime, dbObjToReadable.endTime);
						}
					}
					else
					{
						var tempDisabledExistingEvents = [];
						$('#existingEventsTable tbody tr').each(function() {
							$(this).addClass("disabledRow");
							tempDisabledExistingEvents.push(getEventInFormatFromTableCells($(this)));
							$('.disabledRow input[type=checkbox]').prop("checked", true);
							$('.disabledRow input[type=checkbox]').on("click", function(e) {
								e.preventDefault();
							});
						});
						createDisabledInstance(existingEventsArray, tempDisabledExistingEvents, [], CHANGEDDURATIONTAG);
					}
					
					
					changedDuration();
					
					console.log(stateOfEvent.addedSlots);
					console.log(existingEventsArray);
					console.log(disabledStack);
					
					$('#generalConfirm').modal('toggle');
					stateOfEvent.duration = $("#durationSelector option:selected").val();
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

function buildModalForFormSave(modalHeaderName) {
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
	
	
	// Make Save Form AJAX Call here
	for (let i = 0; i < eventSaveVals.length; i++)
		console.log(eventSaveVals[i]);

}

$('#saveForm').on('click', function() {
	
	buildModalForFormSave("Confirm Save");
	$('#generalConfirm').modal('toggle');
	
	$('#generalAcceptButton').on('click', function() {
		saveFormChanges();
		initFormState();
		$('#generalConfirm').modal('toggle');
	});
				
	$('#generalCancelButton').on('click', function() {
		$('#generalConfirm').modal('toggle');
	});
	
	
});

function buildModalForTimeSave(modalHeaderName, addArray, deleteArray) {
	$('#generalHeaderLabel').text(modalHeaderName);
	
	if (addArray.length > 0) 
	{
		var toBeAdded = $('<div></div>');
		var toBeAddLabel = $('<label> Slots to be ADDED: </label>');
		toBeAdded.append(toBeAddLabel);
		
		var addList =  $('<ul></ul>');
		addList.addClass('list-group saveItemList');

		for (let i = 0; i < addArray.length; i++)
		{
			var slotInfo = databaseDateFormatToReadable(addArray[i]);
			var listItem = $('<li>'+slotInfo.date+' , '+slotInfo.dayName+'  , '+slotInfo.startTime+' - '+slotInfo.endTime+' </li>');
			listItem.addClass('list-group-item toBeAddedSlots');
			addList.append(listItem);
		}
		toBeAdded.append(addList);
		$('.confirmationDescriptionContainer').append(toBeAdded);
		$('.confirmationDescriptionContainer').append('<br><br>');
	}
	
	if (deleteArray.length > 0) 
	{
		var toBeDeleted = $('<div></div>');
		var toBeDeletedLabel = $('<label> Slots to be DELETED: </label>');
		var deleteList = $('<ul></ul>');
		deleteList.addClass('list-group saveItemList');
		toBeDeleted.append(toBeDeletedLabel);
		
		var deleteObjInfoHolder = [];

		for (let i = 0; i < deleteArray.length; i++) {
			var listItem = $('<li>'+deleteArray[i].displayValue+' </li>');
			listItem.addClass('list-group-item toBeDeletedSlots');
			deleteList.append(listItem);
		}
		
		toBeDeleted.append(deleteList);
		$('.confirmationDescriptionContainer').append(toBeDeleted);
		$('.confirmationDescriptionContainer').append('<br><br>');
	}
	
}

function saveTimeChanges(eventAddArray, eventDeleteArray) {
	
	// Make Save Time AJAX call here
	console.log("ADDED SLOTS:")
	console.log(eventAddArray);
	console.log("DELETED SLOTS:")
	console.log(eventDeleteArray);
}

$('#saveSlots').on('click', function() {
	
	var deleteObjInfoHolder = [];

	$("#existingEventsTable tr td:nth-last-child( " + eventDeleteIndex + " )").each(function () {
		if (!$(this).parent().hasClass("disabledRow") && $(this).children().prop("checked")) {
			var deleteObjInfo = getEventInFormatFromTableCells($(this).parent());
			deleteObjInfoHolder.push(deleteObjInfo);
		}
	});
	
	for (let i = 0; i < disabledStack.length; i++)	// Get the disabled slots back into the delete array
		deleteObjInfoHolder = deleteObjInfoHolder.concat(disabledStack[i].disabledSlots);
	
	if (deleteObjInfoHolder.length < 1 && stateOfEvent.addedSlots < 1)
		return;
	
	
	buildModalForTimeSave("Confirm Save", stateOfEvent.addedSlots, deleteObjInfoHolder);
	$('#generalConfirm').modal('toggle');	
	
	
	$('#generalAcceptButton').on('click', function() {
		saveTimeChanges(stateOfEvent.addedSlots, deleteObjInfoHolder);
		$('#generalConfirm').modal('toggle');
		resetTheState();
		initTimeState();
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
		var allSlotsTempArray = existingEventsArray.concat(stateOfEvent.addedSlots);
		if (arraysNoDuplicate(allSlotsTempArray, addEventsCheck) === true)
		{
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

	var eventDate = $('<td>'+date+'</td>');

	var eventDayName = $('<td>'+nameOfDay+'</td>');
	
	var eventStartTime = $('<td>'+startTime+'</td>');
	
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
	
	var deleteText = $('<text> Remove</text>');
	
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
	
	$('#addEventsTable tbody').append(newRow);
	
}

// Input takes a object with start date and end Date (Format: yyyy-mm-dd hh:mm)
function databaseDateFormatToReadable(databaseDateObj) {
	var timeInfo = databaseDateObj.startDate.split(' ');
	var endTimeInfo = databaseDateObj.endDate.split(' ');
		
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
	
	console.log(newSlots);
	
	for (let i = 0; i < newSlots.length; i++) {
		var formattedTime = databaseDateFormatToReadable(newSlots[i]);

		// Values passed in format: mm/dd/yyyy, nameOfDay (e.g. Tuesday), start time (hh:mm AM/PM) - endTime (hh:mm AM/PM)
		appendToAddedTable(formattedTime.date, formattedTime.dayName, formattedTime.startTime, formattedTime.endTime);
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