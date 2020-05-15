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


$('#submitFile').on('click', function () {

    var inputFile = $('#inputFile');

    if (!inputFile.val()) {
        alert('Please upload a file first!');
    }
    else {

		var fileData = inputFile.prop('files')[0];
		var slotKey = window.location.search.split('?key=')[1];

		uploadFile(fileData, slotKey);

    }

})


($(this).find('.myLink').attr('href'));

