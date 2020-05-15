$(document).ready(function () {
	
	$('.visitEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
	$('.returnEventButton').click(function() {
		window.location.href = $(this).children().attr('href');
	});
	
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

	const startTime = document.getElementById('eventStartTimeLabel').children[0];
	startTime.innerText = formatDateTime(startTime.innerText);

	const endTime = document.getElementById('eventEndTimeLabel').children[0];
	endTime.innerText = formatDateTime(endTime.innerText);
	
});


$("#submitFile").on("click", function() {
	if ($('#inputFile').val() == "")
		alert("Please Upload a File");
});

($(this).find('.myLink').attr('href'));