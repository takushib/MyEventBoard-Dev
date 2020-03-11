const eventNameIndex = 1; // Index of event name on table. If table structure changes, this needs to be changed accordingly.
const currPosition = 0;
const eventLinkIndex = 3;

$( document ).ready(function() {
	
	displayNoEventsHeader();
	
});


$( document ).ready(function() {
	
	//console.log($('.linkToEvent').parent().children().eq(eventNameIndex).children().attr('href'));
	
	var eventLinks = $('.linkToEvent').parent().children().eq(eventNameIndex).children().attr('href')
	
	$("#eventsTable tr td:nth-last-child( "+ eventLinkIndex +" )").each(function () {
		var eventLink = $(this).parent().children().eq(eventNameIndex).children().attr('href').toString();

		eventLink = eventLink.replace('manage', 'register');
		pathArray = window.location.pathname.split('/');
		
		var newLink = window.location.protocol + window.location.host + "/" + pathArray[1] + "/" + pathArray[2] + eventLink.slice(1,eventLink.length);
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
	temp_text.addClass('doNotDisplay');
	temp_text.val($(this).next().text());
    temp_text.attr('id', "copyToClipBoard");
	$(this).append(temp_text);
	
	var copyText = document.getElementById("copyToClipBoard");
	
	copyText.select();
    document.execCommand('copy');
	alert("Copied URL:\n" + copyText.value);
	
	$('#copyToClipBoard').remove("copyToClipBoard");

})

function displayNoEventsHeader() {
	if ($('.tableBody').children().length == 0)
	{
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
	displayNoEventsHeader();
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
			displayNoEventsHeader();
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
