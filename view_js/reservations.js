const dateStringLength = 11;
const eventNameIndex = 0;
const eventTimeIndex = 1;
const eventDateIndex = 4;
const deleteIndex = 4;
const currPosition = 0;

$(document).ready(function () {
	displayNoEventsHeader();
	$('#reserveNav').addClass('activeNavItem');
});


function displayNoEventsHeader() {

	if ($('.tableBody').children().length == 0) {

		var noEventsLabel = $('<h3> You are not Reserved for any Events <img src="./NoEventsImg.png" height="100" width="100"></h3>');
		noEventsLabel.addClass('noEvents');

		if (!$('#invitesTable').hasClass('doNotDisplay')) {
			$('#invitesTable').addClass('doNotDisplay');
			$('.yourInvites').append(noEventsLabel);
		}

		if ($('#deleteSelectedConfirmBox').hasClass('doNotDisplay') != true) {
			$('#deleteSelectedConfirmBox').toggleClass('doNotDisplay');
		};

	}

}


$('#deleteConfirm').on('hidden.bs.modal', function () {
	$('.list-group-item').remove();
});

function checkHidePastEventsTable() {
	if($('.pastEventsTable tbody').children().length == 0) {
		$('.pastEventsField').addClass('doNotDisplay');
	}
}

function createPastEventsTable(dateRow, columnNames) {

	for (let i = 0; i < dateRow.length; i++) {
		dateRow[i].children().eq(deleteIndex).children().on( "click", function() {
			deleteEvent($(this));
		});
	}

	if (dateRow.length == 0) return;

	var rowItemCount = columnNames.length;

	var container = $('.entryField1');

	var pastEvents = $('<div></div>');

	var pastEventsField = $('<div></div>');
	
	pastEventsField.addClass('pastEventsField');
	pastEvents.addClass('pastEventsContainer table-responsive');
	pastEventsField.append('<h2> Past Events </h2>');
	pastEventsField.append(pastEvents);
	
	var table = $('<Table></Table>');
	table.addClass('table pastEventsTable table-striped');

	var rowHeader = $('<tr></tr>');
	rowHeader.attr("scope", "row");


	var i = 0;

	while(i < rowItemCount) {
		var header = $('<th>'+columnNames[i]+'</th>');
		header.attr("scope", "col");
		rowHeader.append(header);
		i++;
	}


	var thead = $('<Thead></Thead>');
	thead.append(rowHeader);


	var tbody = $('<Tbody></Tbody>');

	for (let i = 0; i < dateRow.length; i++) {
		tbody.append(dateRow[i]);
	}

	table.append(thead);
	table.append(tbody);

	pastEvents.append(table);
	container.append(pastEventsField);
	displayNoEventsHeader();

}


$( document ).ready(function() {

	var columnNames = [];

	$('#invitesTable thead tr th').each(function(index) {
		columnNames.push($(this).html());
	});


	var dateRow = [];
	var curDate = new Date();

	$("#invitesTable tr td:nth-last-child( "+ eventDateIndex +" )").each(function () {

		var newDate = $(this).text().replace(/-/g, "/");

		var dateStrs = newDate.split(" ");


		var dt = new Date(dateStrs[0]);


		var timeStrs = dateStrs[1].split(":");

		dt.setHours(timeStrs[0]);
		dt.setMinutes(timeStrs[1]);
		dt.setSeconds(timeStrs[2]);


		if (dt < curDate) {
			var linkToPastEvent = $(this).parent().children().eq(eventNameIndex).children();
		//	linkToPastEvent.removeAttr("href");
			dateRow.push($(this).parent());
			$(this).parent().remove();
		}
		
	});

	createPastEventsTable(dateRow, columnNames);

});


function getHash(eventItem){
	return eventItem.parent().parent().attr('id');
}


function deleteEvent(eventDeleteObj) {

	$('#deleteConfirm').modal('toggle');

	var listItem = $('<li> ' + eventDeleteObj.parent().parent().children().eq(eventNameIndex).text() + "at " + eventDeleteObj.parent().parent().children().eq(eventTimeIndex).text() + ' </li>');
	listItem.addClass('list-group-item');
	$('.containerForEventsToDelete ul').append(listItem);

	var hashKey = getHash(eventDeleteObj);
	//console.log(hashKey);

	$('#deleteSubmitButton').on('click', function () {

		$('#deleteConfirm').modal('toggle');

		$.ajax({
			url: "delete_reservation.php",
			type: "POST",
			data: { key: hashKey }
		}).done(function (response) {
			console.log(response);
		});


		$('#feedBackModalDelete').modal('toggle');
		eventDeleteObj.parent().parent().remove();
		
		displayNoEventsHeader(); // check if need to show header for no Events
		checkHidePastEventsTable(); // hide past events table if no past events

	})

}


$('.deleteEvent').on('click', function () {
	deleteEvent($(this));
})
