$( document ).ready(function() {
    console.log( "ready!" );
});

$('.deleteEvent').on('click', function () {
  $('#deleteConfirm').modal('toggle');
  var currentEvent = $(this);
  
  $('#deleteSubmitButton').on('click', function () {
	$('#deleteConfirm').modal('toggle');
	$('#feedBackModalDelete').modal('toggle');
	currentEvent.parent().parent().remove();
  })
  
})

$('.deleteSelectButton').on('click', function () {
  $('.deleteSelectButton').toggleClass('toggled');
  $('.massDeleteOn').toggleClass('doNotDisplay');
  $('.deleteEvent').toggleClass('doNotDisplay');
})

$('.massDeleteOn').on('click', function () {
	$(this).parent().parent().remove();
});

$('.editEventButton').on('click', function () {

	console.log("edit");
});

$(document).ready(function () {
	$('#manageNav').addClass('activeNavItem');
});
