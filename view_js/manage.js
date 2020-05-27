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
	
	initializeEmptyDownloadItems();
	
	
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
	
	$('.deleteUserSlot').on("click", function() {
		
		var userTimeSlot = $(this).parent().parent().children().eq(0).text();
		var userName = $(this).parent().parent().children().eq(1).text();
		$('#deleteUserHeader').text('Deleting Slot:   [ '+userName+'   at   '+userTimeSlot+' ]');
		$('#deleteUser').modal('toggle');
		
		$('#deleteUserSubmitButton').off();
		$('#deleteUserSubmitButton').on("click", function() {
			$('#deleteUser').modal('toggle');
			//Delete user from slot here
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

function initializeEmptyDownloadItems() {
	$(".fileDownloadFile").each(function() {
		//console.log($(this).attr("href"));
		if ($(this).attr("href") == "../")
			$(this).replaceWith( "<text>None</text>");
	});
}


($(this).find('.myLink').attr('href'));