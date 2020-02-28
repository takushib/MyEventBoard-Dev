const eventNameIndex = 1; // Index of event name on table. If table structure changes, this needs to be changed accordingly.

$( document ).ready(function() {
    console.log( "ready!" );
	
});

$('.deleteEvent').on('click', function () {
  $('#deleteConfirm').modal('toggle');
  
  var listItem = $('<li> '+ $(this).parent().parent().children().eq(eventNameIndex).text() +' </li>');
  listItem.addClass('list-group-item');
  $('.containerForEventsToDelete ul').append(listItem);
  
  var currentEvent = $(this);
  
  $('.containerForEventsToDelete ul').append(listItem);
  $('#deleteSubmitButton').on('click', function () {
	$('#deleteConfirm').modal('toggle');
	$('#feedBackModalDelete').modal('toggle');
	currentEvent.parent().parent().remove();
  })
  
})

function massDelete(arrayWithReadyToDeleteEvents) 
{
	$('#deleteConfirm').modal('toggle');
	
	arrayWithReadyToDeleteEvents.forEach(number => {
		var listItem = $('<li> '+ number.parent().children().eq(eventNameIndex).text() +' </li>');
		listItem.addClass('list-group-item');
		$('.containerForEventsToDelete ul').append(listItem);
	});
	
	$('#deleteSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
		$('#feedBackModalDelete').modal('toggle');
		
		arrayWithReadyToDeleteEvents.forEach(number => {
			number.parent().remove();
		});
	})
}


$('#deleteConfirm').on('hidden.bs.modal', function () {
  $('.list-group-item').remove();
});

$('.deleteSelectButton').on('click', function () {
  $('.deleteSelectButton').toggleClass('toggled');
  $('.massDeleteOn').toggleClass('doNotDisplay');
  $('.deleteEvent').toggleClass('doNotDisplay');
  $('.deleteSelectButtonConfirm').toggleClass('doNotDisplay');
})

$('.deleteSelectButtonConfirm').on('click', function () {
	
	// Loop through last column and delete selected
	var atLeastOnSelected = false;
	var tempHolder = [];
	
	$("#eventsTable tr td:nth-last-child( "+ eventNameIndex +" )").each(function () {
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

$('.editEventButton').on('click', function () {

	console.log("edit");
});

$(document).ready(function () {
	$('#manageNav').addClass('activeNavItem');
});
