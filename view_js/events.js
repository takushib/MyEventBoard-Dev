const eventNameIndex = 1; // Index of event name on table. If table structure changes, this needs to be changed accordingly.
const currPosition = 0;
$( document ).ready(function() {
    console.log( "ready!" );
});

$('.deleteEvent').on('click', function () {
  $('#deleteConfirm').modal('toggle');

  var listItem = $('<li> '+ $(this).parent().parent().children().eq(eventNameIndex).text() +' </li>');
  listItem.addClass('list-group-item');
  $('.containerForEventsToDelete ul').append(listItem);

  var currentEvent = $(this);

  console.log();
  $('.containerForEventsToDelete ul').append(listItem);
  $('#deleteSubmitButton').on('click', function () {
  	$('#deleteConfirm').modal('toggle');
    //delete here
    $.ajax({
  		url:"delete_event.php",
  		type: "POST",
  		data: {eid: currentEvent.parent().parent().eq(currPosition).text()},
  	}).done(function(response) {
      console.log(response);
  	});
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
    arrayWithReadyToDeleteEvents.forEach(number => {
      $.ajax({
    		url:"delete_event.php",
    		type: "POST",
    		data: {eid: number.parent().eq(currPosition).text()},
    	}).done(function(response) {
        console.log(response);
    	});
			number.parent().remove();

		});
		$('#feedBackModalDelete').modal('toggle');
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
