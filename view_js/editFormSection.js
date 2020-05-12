const formState = {
						eventName: "",
						eventLocation: "",
						eventDescription: "",
						eventFileOption: false,
						eventAnonymousOption: true
				  };

$(document).ready(function () {
	initLocationInput();
	initFormState();
});


//source: https://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element
function initLocationInput() {
	var dataList = document.getElementById('locationDatalist');
	var input = document.getElementById('locationInput');
	
	
	// Create a new XMLHttpRequest.
	var request = new XMLHttpRequest();

	// Handle state changes for the request.
	request.onreadystatechange = function(response) {
		if (request.readyState === 4) {
			if (request.status === 200) {
				// Parse the JSON
				var jsonOptions = JSON.parse(request.responseText);

				// Loop over the JSON array.
				jsonOptions.forEach(function(item) {
				
				// Create a new <option> element.
				var option = document.createElement('option');
				
				// Set the value using the item in the JSON array.
				option.value = item.name;
				
				// Add the <option> element to the <datalist>.
				dataList.appendChild(option);
				});

				// Update the placeholder text.
				input.placeholder = "Enter a Location";
			} else {
				// An error occured :(
				input.placeholder = "Couldn't load location options :(";
			}
		}
	};

	// Update the placeholder text.
	input.placeholder = "Loading options...";

	// Set up and make the request.
	request.open('GET', 'OSU_locations.json', true);
	request.send();
}

function initFormState() {

	var databaseObj = [];

	var rawEntries = document.getElementsByClassName('eventDataForFormEntry');

	for (var entry of rawEntries) {
		var parsedEntry = JSON.parse(entry.innerText);
		databaseObj.push(parsedEntry);
	}

	while (rawEntries.length > 0) rawEntries[0].remove();
	console.log(databaseObj);
	
	var dbEventName = databaseObj[0]['name'];		//get the database form values for event
	var dbEventLocation = databaseObj[0]['location'];
	var dbFileOption = false; // Replace this with File option from DB
	var dbAnonymousOption = true; // Replace this with Anonymous option from DB
	var dbEventDescription = databaseObj[0]['description'];
	
	formState.eventName = dbEventName;				//store database form values in as a cached object
	formState.eventLocation = dbEventLocation;
	formState.eventDescription = dbEventDescription;
	formState.fileOption = dbFileOption;
	formState.anonymousOption = dbAnonymousOption;
	
	
	$('#eventNameInput').val(dbEventName);
	$('#locationInput').val(dbEventLocation);
	$('#eventDescriptTextArea').val(dbEventDescription);
	$('#anonymousCheck').prop("checked", dbAnonymousOption);
	$('#fileUpload').prop("checked", dbFileOption);
	
	console.log(formState);
}	

$('#resetFormButton').on('click', function () {
	
	$('#eventNameInput').val(formState.eventName);
	$('#locationInput').val(formState.eventLocation);
	$('#eventDescriptTextArea').val(formState.eventDescription);
	$('#anonymousCheck').prop("checked", formState.eventAnonymousOption);
	$('#fileUpload').prop("checked", formState.eventFileOption);
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
	eventSaveVals.push(newEventFileOption);
	eventSaveVals.push(newEventAnonymousCheck);


	// Make Save Form AJAX Call here
	for (let i = 0; i < eventSaveVals.length; i++)
		console.log(eventSaveVals[i]);

	// Reinitialize cached data needs to be done after ajax call
}