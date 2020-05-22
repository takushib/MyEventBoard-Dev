const eventNameIndex = 1; // Index of event name on table. If table structure changes, this needs to be changed accordingly.
const currPosition = 0;
const eventLinkIndex = 1;

$( document ).ready(function() {

	$('#manageNav').addClass('activeNavItem');
	displayNoEventsHeader();
	
	$(".linkColumn").each(function () {

		var eventLink = $(this).parent().children().find('a:first').attr('href');
		
		eventLink = eventLink.replace('manage', 'register');
		pathArray = window.location.pathname.split('/');

		var newLink = window.location.protocol + "//" + window.location.host + "/" + pathArray[1] + "/" + pathArray[2] + eventLink.slice(1,eventLink.length);

		var newLinkItem = $('<a href='+newLink+'>'+newLink+'</a>');
		newLinkItem.addClass('linkToEvent');
		newLinkItem.attr('id', 'linkToEvent');
		$(this).append(newLinkItem);
	});

});


$('.copy').on('click', function () {

	var temp_text = $('<input></input>');
	temp_text.attr("type", "text");
	temp_text.val($(this).next().text().toString());

    temp_text.attr('id', "copyToClipBoard");
	$(this).append(temp_text);

	var copyText = document.getElementById("copyToClipBoard");

	copyText.select();
	copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
	$('#copyToClipBoard').remove();
	alert("Copied to Clipboard!");

})

function displayNoEventsHeader() {
	if ($('.tableBody').children().length == 0) {
		$('#eventsTable').addClass('doNotDisplay');
		var noEventsLabel = $('<h3> No Events Created <img src="./NoEventsImg.png" height="100" width="100"></h3>');
		noEventsLabel.addClass('noEvents');
		$('.yourEvents').append(noEventsLabel);

		if ($('#deleteSelectedConfirmBox').hasClass('doNotDisplay') != true) {
			$('#deleteSelectedConfirmBox').toggleClass('doNotDisplay');
		};
	}
}

