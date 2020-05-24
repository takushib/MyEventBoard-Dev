$(document).ready(function () {
	
	$('.visitEvent').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	$('.editEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	$('.returnEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	var hashForEventFromURL = window.location.href;
	var hashKey = hashForEventFromURL.split("?key=");
	
	$('#deleteEventButton').on("click", function() {
		$('#deleteConfirm').modal('toggle');
		
		$('#deleteSubmitButton').off();
		$('#deleteSubmitButton').on("click", function() {
			$('#deleteConfirm').modal('toggle');
			
			deleteThisEvent(hashKey[1]);
			$('.entryField1').empty();
			
			var removedContainer = $('<div></div>');
			removedContainer.addClass("removedContainer");
			
			var returnButton = $('<button> Return to Managing Events </Button>');
			returnButton.addClass('btn btn-dark');
			
			returnButton.on('click', function() {
				window.location.href = "./events";
			});
			
			removedContainer.append('<h3> Event Has Been Deleted </h3>');
			removedContainer.append(returnButton);
			
			$('.entryField1').append('<br><br>');
			$('.entryField1').append(removedContainer);
		});
		
	});
	
	$('#inviteEventButton').on("click", function() {
		$('#massInvite').modal('toggle');
		
		$('#inviteSubmitButton').off();
		$('#inviteSubmitButton').on("click", function() {
			$('#inviteConfirm').modal('toggle');
			//send invitation emails here
		});
		
	});
	
});

function deleteThisEvent(hashKey) {
	
	$.ajax({
		url: "delete_event.php",
		type: "POST",
		data: { key: hashKey },
	}).done(function (response) {
		console.log(response);
	});
}

($(this).find('.myLink').attr('href'));