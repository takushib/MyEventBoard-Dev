$(document).ready(function () {

	disableEnterInputOnFields();
	
	document.getElementById("field1to2").addEventListener("click", function () {
		$('.entryField1').addClass('collapse');
		$('.entryField2').removeClass('collapse');
	})

	document.getElementById("field2to1").addEventListener("click", function () {
		$('.entryField2').addClass('collapse');
		$('.entryField1').removeClass('collapse');
	})

});

function disableEnterInputOnFields() {

	$('form input').keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});
}

function buildModalForChangeConfirmation(modalHeaderName, description) {

	$('#generalHeaderLabel').text(modalHeaderName);

	var warningLabel = $('<label>*Warning*</label>');
	warningLabel.attr("id", "warningTag");
	var warningMessage = $('<text> ' + description + ' </text>');
	warningMessage.attr("id", "confirmationDescription");

	$('.confirmationDescriptionContainer').append(warningLabel);
	$('.confirmationDescriptionContainer').append('<br>');
	$('.confirmationDescriptionContainer').append('<br>');
	$('.confirmationDescriptionContainer').append(warningMessage);

	$('#generalAcceptButton').off();
	$('#generalCancelButton').off();

}

$('#generalConfirm').on('hidden.bs.modal', function () {

	resetCanceledInput();
	clearModal();
});


function clearModal() {

	$('.confirmationDescriptionContainer').empty();
	$('#generalAcceptButton').off();
	$('#generalCancelButton').off();
	$('.close').off();
	$('#generalHeaderLabel').text("");
}

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

// Menu Toggle Script

$("#menu-toggle").click(function (e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});