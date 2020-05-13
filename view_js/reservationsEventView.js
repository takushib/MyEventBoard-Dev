$(document).ready(function () {
	
	$('.visitEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	$('.returnEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	init();
	
	$('#deleteEventButton').on("click", function() {
		$('#deleteConfirm').modal('toggle');
		
		$('#deleteSubmitButton').off();
		$('#deleteSubmitButton').on("click", function() {
			$('#deleteConfirm').modal('toggle');
			$('.entryField1').empty();
			
			var removedContainer = $('<div></div>');
			removedContainer.addClass("removedContainer");
			
			var returnButton = $('<button> Return to Viewing Reservations </Button>');
			returnButton.addClass('btn btn-dark');
			
			returnButton.on('click', function() {
				window.location.href = "./reservations";
			});
			
			removedContainer.append('<h3> Registered Slot Has Been Deleted </h3>');
			removedContainer.append(returnButton);
			
			$('.entryField1').append('<br><br>');
			$('.entryField1').append(removedContainer);
		});
		
	});
	
});


$("#submitFile").on("click", function() {
	if ($('#inputFile').val() == "")
		alert("Please Upload a File");
});


function init() {

	var fileUploadCheck = true; //replace with db value for event
	 
	if (fileUploadCheck == false)
		$('.fileUploadContainer').remove();
	
	var startTime = "Replace me with Start Time";
	var endTime = "Replace me with End Time";
	var locationOfEvent  = "Replace me with Location";
	var eventCreator = "Replace me with Creator";
	var description = "Replace me with Description";
	var uploadedFile = "ReplaceWithFileName";
	
	var startTimeElement = $('<text>'+ startTime +'</text>');
	var endTimeElement = $('<text>'+ endTime +'</text>');
	var locationOfEventElement = $('<text>'+ locationOfEvent +'</text>');
	var eventCreatorElement = $('<text>'+ eventCreator +'</text>');
	var descriptionElement = $('<text>'+ description +'</text>');
	var fileElement = $('<a>'+ uploadedFile +'</a>');
	var downloadLinkToFile = "replacethiswithfile.txt";
	fileElement.attr("href", downloadLinkToFile);
	fileElement.attr("download", true);
	
	$('#eventStartTimeLabel').append(startTimeElement);
	$('#eventEndTimeLabel').append(endTimeElement);
	$('#eventLocationLabel').append(locationOfEventElement);
	$('#eventCreatorLabel').append(eventCreatorElement);
	
	if (description != "")
		$('#eventDescriptionLabel').append(descriptionElement);
	else
		$('#eventDescriptionLabel').remove();
	
	if (fileUploadCheck == true)
		$('#eventFileLabel').append(fileElement);
	else
		$('#eventFileLabel').remove();
}


($(this).find('.myLink').attr('href'));