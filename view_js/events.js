const eventNameIndex = 1; // Index of event name on table. If table structure changes, this needs to be changed accordingly.
const currPosition = 0;
const eventLinkIndex = 3;

$(document).ready(function () {

	displayNoEventsHeader();

});



$( document ).ready(function() {

	$("#eventsTable tr td:nth-last-child( "+ eventLinkIndex +" )").each(function () {

		var eventLink = $(this).parent().children().eq(eventNameIndex).children().attr('href');
		eventLink = eventLink.replace('manage', 'register');
		pathArray = window.location.pathname.split('/');

		var newLink = window.location.protocol + "//" + window.location.host + "/" + pathArray[1] + "/" + pathArray[2] + eventLink.slice(1,eventLink.length);
		var hrefLink = "/" + pathArray[1] + "/" + pathArray[2] + eventLink.slice(1,eventLink.length);

		var newLinkItem = $('<a href='+hrefLink+'>'+newLink+'</a>');
		newLinkItem.addClass('linkToEvent');
		newLinkItem.attr('id', 'linkToEvent');
		$(this).append(newLinkItem);
	});

});


$('.copy').on('click', function () {

	var temp_text = $('<input></input>');
	temp_text.attr("type", "text");
	temp_text.val($(this).next().text().toString());

    temp_text.attr('id', "copyToClipBoard");
	$(this).append(temp_text);

	var copyText = document.getElementById("copyToClipBoard");

	copyText.select();
	copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
	$('#copyToClipBoard').remove();
	alert("Copied to Clipboard!");


})

function displayNoEventsHeader() {
	if ($('.tableBody').children().length == 0) {
		$('#eventsTable').addClass('doNotDisplay');
		var noEventsLabel = $('<h3> No Events Created <img src="./NoEventsImg.png" height="100" width="100"></h3>');
		noEventsLabel.addClass('noEvents');
		$('.yourEvents').append(noEventsLabel);

		if ($('#deleteSelectedConfirmBox').hasClass('doNotDisplay') != true) {
			$('#deleteSelectedConfirmBox').toggleClass('doNotDisplay');
		};
	}
}

$('.deleteEvent').on('click', function () {
	$('#deleteMassSubmitButton').off();
	$('#deleteMassSubmitButton').attr('id', "deleteSubmitButton");
	$('#deleteSubmitButton').off();
	$('#deleteConfirm').modal('toggle');

	var listItem = $('<li> ' + $(this).parent().parent().children().eq(eventNameIndex).text() + ' </li>');
	listItem.addClass('list-group-item');
	$('.containerForEventsToDelete ul').append(listItem);

	var currentEvent = $(this);

	$('.containerForEventsToDelete ul').append(listItem);

	$('#deleteSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
		console.log(currentEvent.parent().parent().children().eq(currPosition).text());
		$.ajax({
			url: "delete_event.php",
			type: "POST",
			data: { key: currentEvent.parent().parent().children().eq(currPosition).text() },
		}).done(function (response) {
			console.log(response);
		});

		$('#feedBackModalDelete').modal('toggle');
		currentEvent.parent().parent().remove();
		displayNoEventsHeader();
	})

})

function massDelete(arrayWithReadyToDeleteEvents) {

	$('#deleteSubmitButton').off();
	$('#deleteSubmitButton').attr('id', "deleteMassSubmitButton");
	$('#deleteMassSubmitButton').off();
	$('#deleteConfirm').modal('toggle');

	arrayWithReadyToDeleteEvents.forEach(number => {
		var listItem = $('<li> ' + number.parent().children().eq(eventNameIndex).text() + ' </li>');
		listItem.addClass('list-group-item');
		$('.containerForEventsToDelete ul').append(listItem);
	});

	$('#deleteMassSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
		arrayWithReadyToDeleteEvents.forEach(number => {
			$.ajax({
				url: "delete_event.php",
				type: "POST",
				data: { key: number.parent().children().eq(currPosition).text() },
			}).done(function (response) {
				console.log(response);
			});
			number.parent().remove();
			displayNoEventsHeader();
		});
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

	$("#eventsTable tr td:nth-last-child( " + eventNameIndex + " )").each(function () {
		if ($(this).children().prop("checked")) {
			tempHolder.push($(this));
			atLeastOnSelected = true;
		}
	});

	if (atLeastOnSelected == false)
		alert("No Event Selected");
	else
		massDelete(tempHolder);

});


$(document).ready(function () {
	$('#manageNav').addClass('activeNavItem');
});
