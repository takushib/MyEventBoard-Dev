
const dateStringLength = 11;
const eventNameIndex = 0;
const eventTimeIndex = 1;
const eventDateIndex = 4;
const deleteIndex = 4;
$(document).ready(function () {

	displayNoEventsHeader();

});

function displayNoEventsHeader() {
	if ($('.tableBody').children().length == 0) {
		$('#invitesTable').addClass('doNotDisplay');
		var noEventsLabel = $('<h3> You are not Reserved for any Events <img src="./NoEventsImg.png" height="100" width="100"></h3>');
		noEventsLabel.addClass('noEvents');

		$('.yourInvites').append(noEventsLabel);

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
		$('.pastEventsContainer').addClass('doNotDisplay');
	}
}

function createPastEventsTable(dateRow, columnNames) {
	
	for (let i = 0; i < dateRow.length; i++) {
		dateRow[i].children().eq(deleteIndex).children().on( "click", function() {
			deletePastEvent($(this));
		});
	}
	
	if (dateRow.length == 0)
		return;
	
	var rowItemCount = columnNames.length;
	
	var container = $('.entryField1');
	
	var pastEvents = $('<div></div>');
	pastEvents.addClass('pastEventsContainer');
	pastEvents.append('<h2> Past Events </h2>');
	
	
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
	container.append(pastEvents);
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
			linkToPastEvent.removeAttr("href");
			dateRow.push($(this).parent());	
			$(this).parent().remove();
		}
	});
	
	createPastEventsTable(dateRow, columnNames);
});


function deletePastEvent(pastEvent) {
	$('#deleteConfirm').modal('toggle');

	
	var listItem = $('<li> ' + pastEvent.parent().parent().children().eq(eventNameIndex).text() + "at " + pastEvent.parent().parent().children().eq(eventTimeIndex).text() + ' </li>');
	listItem.addClass('list-group-item');
	$('.containerForEventsToDelete ul').append(listItem);


	$('.containerForEventsToDelete ul').append(listItem);

	
	$('#deleteSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
	/*	$.ajax({
			url: "delete_event.php",
			type: "POST",
			data: { key: currentEvent.parent().parent().children().eq(currPosition).text() },
		}).done(function (response) {
			console.log(response);
		});
*/
		$('#feedBackModalDelete').modal('toggle');
		pastEvent.parent().parent().remove();
		checkHidePastEventsTable();   // hide past events table if no past events
	})
}


$('.deleteEvent').on('click', function () {

	$('#deleteConfirm').modal('toggle');

	var listItem = $('<li> ' + $(this).parent().parent().children().eq(eventNameIndex).text() + "at " + $(this).parent().parent().children().eq(eventTimeIndex).text() + ' </li>');
	listItem.addClass('list-group-item');
	$('.containerForEventsToDelete ul').append(listItem);

	var currentEvent = $(this);

	$('.containerForEventsToDelete ul').append(listItem);

	
	$('#deleteSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
	/*	$.ajax({
			url: "delete_event.php",
			type: "POST",
			data: { key: currentEvent.parent().parent().children().eq(currPosition).text() },
		}).done(function (response) {
			console.log(response);
		});
*/
		$('#feedBackModalDelete').modal('toggle');
		currentEvent.parent().parent().remove();
		displayNoEventsHeader();
	})
	
})
