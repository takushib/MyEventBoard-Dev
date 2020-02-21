$( document ).ready(function() {
    console.log( "ready!" );
	
});

$('.deleteEvent').on('click', function () {
  $('#deleteConfirm').modal('toggle');
  
  var listItem = $('<li> '+ $(this).parent().parent().children().eq(1).text() +' </li>');
  listItem.addClass('list-group-item');
  $('.containerForEventsToDelete ul').append(listItem);
  
  var currentEvent = $(this);
  
  $('.containerForEventsToDelete ul').append(listItem);
  $('#deleteSubmitButton').on('click', function () {
	$('#deleteConfirm').modal('toggle');
	$('#feedBackModalDelete').modal('toggle');
	currentEvent.parent().parent().remove();
	$('.list-group-item').remove();
  })
  
})

function massDelete(arrayWithReadyToDeleteEvents) 
{
	$('#deleteConfirm').modal('toggle');
	
	arrayWithReadyToDeleteEvents.forEach(number => {
		var listItem = $('<li> '+ number.parent().children().eq(1).text() +' </li>');
		listItem.addClass('list-group-item');
		$('.containerForEventsToDelete ul').append(listItem);
	});
	
	$('#deleteSubmitButton').on('click', function () {
		$('#deleteConfirm').modal('toggle');
		$('#feedBackModalDelete').modal('toggle');
		
		arrayWithReadyToDeleteEvents.forEach(number => {
			number.parent().remove();
		});
		
		$('.list-group-item').remove();
	})
}

$('#deleteCancelButton').on('click', function () {
		$('.list-group-item').remove();
})


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
	
	$("#eventsTable tr td:nth-last-child(1)").each(function () {
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
