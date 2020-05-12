const formState = {
	eventName: "",
	eventLocation: "",
	eventDescription: "",
	eventAnonymousOption: true,
	eventFileOption: false
};

$(document).ready(function () {

	var locationsDropDown;

	$.getJSON('OSU_locations.json', function (data) {

		$.each(data, function (i, locations) {
			locations.name = locations.name.replace("'", "&#39");
			locationsDropDown += "<option value='" + locations.name + "'>" + locations.name + "</option>"
		});

		$('#locationInput').append(locationsDropDown);

		initFormState();

	});
	
});

function initFormState() {

	var databaseObj = [];

	var rawEntries = document.getElementsByClassName('eventDataForFormEntry');

	for (var entry of rawEntries) {
		var parsedEntry = JSON.parse(entry.innerText);
		databaseObj.push(parsedEntry);
	}

	while (rawEntries.length > 0) rawEntries[0].remove();
	console.log(databaseObj);
	
	var dbEventName = databaseObj[0]['name'];
	var dbEventLocation = databaseObj[0]['location'];
	var dbFileOption = databaseObj[0]['upload'];
	var dbAnonymousOption = databaseObj[0]['anonymous'];
	var dbEventDescription = databaseObj[0]['description'];
	
	// store database form values in as a cached object

	formState.eventName = dbEventName;				
	formState.eventLocation = dbEventLocation;
	formState.eventDescription = dbEventDescription;
	formState.anonymousOption = dbAnonymousOption;
	formState.fileOption = dbFileOption;
	
	// set fields in form
	$('#eventNameInput').val(dbEventName);
	$('#locationInput').val(dbEventLocation);
	$('#eventDescriptTextArea').val(dbEventDescription);

	$('#anonymousCheck').prop("checked", false);
	if (dbAnonymousOption == 1) $('#anonymousCheck').prop("checked", true);

	$('#fileUpload').prop("checked", false);
	if (dbFileOption == 1) $('#fileUpload').prop("checked", true);
	
	console.log(formState);

}	

$('#resetFormButton').on('click', function () {
	
	$('#eventNameInput').val(formState.eventName);
	$('#locationInput').val(formState.eventLocation);
	$('#eventDescriptTextArea').val(formState.eventDescription);

	$('#anonymousCheck').prop("checked", false);
	if (formState.anonymousOption == 1) $('#anonymousCheck').prop("checked", true);

	$('#fileUpload').prop("checked", false);
	if (formState.fileOption == 1) $('#fileUpload').prop("checked", true);

});

$('#fileUpload').on('click', function (e) {

	e.preventDefault();
	
	buildModalForChangeConfirmation("Confirm Change", "Saving this field unchecked (File Upload Field) will cause files currently uploaded to this event to be deleted");
	$('#generalConfirm').modal('toggle');

	$('#generalAcceptButton').on('click', function () {
		$('#generalConfirm').modal('toggle');
		$('#fileUpload').prop("checked", !$('#fileUpload').prop("checked"));
	});

});

$('#anonymousCheck').on('click', function (e) {

	e.preventDefault();
	
	buildModalForChangeConfirmation("Confirm Change", "Saving this field unchecked (Anonymous Field) will make registered users visible to other users upon event registration.");
	
	$('#generalConfirm').modal('toggle');

	$('#generalAcceptButton').on('click', function () {
		$('#generalConfirm').modal('toggle');
		$('#anonymousCheck').prop("checked", !$('#anonymousCheck').prop("checked"));
	});

});

function buildModalForFormSave(modalHeaderName) {
	$('#generalHeaderLabel').text(modalHeaderName);

	var newEventName = $('#eventNameInput').val();
	var newEventLocation = $('#locationInput').val();
	var newEventDescript = $('#eventDescriptTextArea').val();
	var newEventAnonymousCheck = $('#anonymousCheck').prop('checked');
	var newEventFileOption = $('#fileUpload').prop('checked');

	const EVENT_DESCRIPT_LIST_LABEL = "Event Description";
	var eventSaveVals = [];

	eventSaveVals.push(["Event Name", newEventName]);
	eventSaveVals.push(["Event Location", newEventLocation]);
	eventSaveVals.push(["Event Description", newEventDescript]);
	eventSaveVals.push(["Event Anonymous Option", newEventAnonymousCheck]);
	eventSaveVals.push(["Event File Option", newEventFileOption]);
	
	var eventDbVals = [];
	eventDbVals.push(formState.eventName);
	eventDbVals.push(formState.eventLocation);
	eventDbVals.push(formState.eventDescription);
	eventDbVals.push(formState.eventAnonymousOption);
	eventDbVals.push(formState.eventFileOption);
	
	var list = $('<ul></ul>');
	list.addClass('list-group saveItemList');
	$('.confirmationDescriptionContainer').append(list);

	for (let i = 0; i < eventSaveVals.length; i++) {
		if (typeof eventSaveVals[i][1] === "boolean") {

			var changeItem;
			
			if (eventSaveVals[i][1] === false) {
				var offLabel = $('<text>OFF</text>');
				offLabel.addClass('offLabel');
				changeItem = $('<li><label>' + eventSaveVals[i][0] + ':</label> </li>');
				changeItem.append(offLabel);
			}
			else if (eventSaveVals[i][1] === true) {
				var onLabel = $('<text>ON</text>');
				onLabel.addClass('onLabel');
				changeItem = $('<li><label>' + eventSaveVals[i][0] + ':</label> </li>');
				changeItem.append(onLabel);
			}
			
			if (eventSaveVals[i][1] == eventDbVals[i])
				changeItem.append(" (Unchanged)");
		}
		else if (eventSaveVals[i][1] === "" || eventSaveVals[i][1] == eventDbVals[i]) {
				var changeItem = $('<li><label>' + eventSaveVals[i][0] + ':</label> Unchanged</li>');
		}
		else {
			var itemValue = $('<text>' + eventSaveVals[i][1] + '</text>');
			itemValue.addClass('changedLabel');
			var changeItem = $('<li><label>' + eventSaveVals[i][0] + ':</label> </li>');
			changeItem.append(itemValue);
		}
		changeItem.addClass('list-group-item');
		$('.confirmationDescriptionContainer ul').append(changeItem);
	}
}

$('#saveForm').on('click', function () {

	buildModalForFormSave("Confirm Save");
	$('#generalConfirm').modal('toggle');

	$('#generalAcceptButton').on('click', function () {
		saveFormChanges();
		$('#generalConfirm').modal('toggle');
	});

	$('#generalCancelButton').on('click', function () {
		$('#generalConfirm').modal('toggle');
	});

});


function saveFormChanges() {

	var newEventName = $('#eventNameInput').val();
	var newEventLocation = $('#locationInput').val();
	var newEventDescript = $('#eventDescriptTextArea').val();
	var newEventFileOption = $('#fileUpload').prop('checked');
	var newEventAnonymousCheck = $('#anonymousCheck').prop('checked');

	var eventSaveVals = [];

	eventSaveVals.push(newEventName);
	eventSaveVals.push(newEventLocation);
	eventSaveVals.push(newEventDescript);
	eventSaveVals.push(newEventAnonymousCheck);
	eventSaveVals.push(newEventFileOption);

	console.log(eventSaveVals);

	$.ajax({
		type: "POST",
		url: "edit_event_details.php",
		data: {
			eventHash: window.location.search.split('?key=')[1],
			eventName: eventSaveVals[0],
			eventLocation: eventSaveVals[1],
			eventDescription: eventSaveVals[2],
			isAnonymous: eventSaveVals[3],
			enableUpload: eventSaveVals[4]
		}
	}).done(function(response) {
		alert(response);
	});

	// Reinitialize cached data needs to be done after ajax call

}