function createEventBlock(eventName, creatorName, slotsRemaining, eventTime)
{
	var titleContainer = $('<div></div>');
	titleContainer.addClass("titleContainer");

	var newEvent = $('<div></div>');

	var newEventName = $('<div><text></text></div>');
	var eventNameText = eventName;

	//var newEventIcon = $('<div><img src="./icon.png"></img></div>');
	var newEventIcon = $('<img src="./icon.png"></img>');

	var newEventCreator = $('<div><text></text></div>');
	var creatorText = creatorName;

	var timeOfEvent = $('<div><text></text></div>');

	var newEventAvailSlot = $('<div><text></text></div>');
	var slotsText = "Slots: ";
	slotsText = slotsText + slotsRemaining + " remaining";

	newEventName.text(eventNameText);
	newEventName.addClass("eventBlockName");
	newEventName.addClass("Container");

	newEventIcon.addClass("eventIcon");


	newEventCreator.text(creatorText);
	newEventCreator.addClass("eventBlockCreator");
	newEventCreator.addClass("Container");

	timeOfEvent.text(eventTime);
	timeOfEvent.addClass("eventBlockSpace");
	timeOfEvent.addClass("Container");

	//newEventAvailSlot.text(slotsText);
	//newEventAvailSlot.addClass("eventBlockSpace");

	titleContainer.append(newEventName);
	titleContainer.append(newEventIcon);
	//newEvent.append(newEventName);
	//newEvent.append(newEventIcon);
	newEvent.append(titleContainer);
	newEvent.append(newEventCreator);
	newEvent.append(timeOfEvent);
	//newEvent.append(newEventAvailSlot);


	newEvent.addClass("eventBlock");
	return newEvent;
}

function formatTime(time) {
	var temp = time.slice(11,13);
	var hour = parseInt(temp);
	//console.log(hour);
	if(hour > 12) {
		var newHour = hour - 12;
		var newTime = newHour.toString() + time.slice(13,16) + " PM";
		return newTime;
	}
	else if(hour === 12) {
		var newTime = hour.toString() + time.slice(13,16) + " PM";
		return newTime;
	}
	else {
		var newTime = hour.toString() + time.slice(13,16) + " AM";
		return newTime;
	}
}

$(document).ready(function () {
	var events;
	$.ajax({
		url: "fill_dashboard.php",
		type: "POST",
		data: {user_id: 'takushib'},
	}).done(function(response) {
		events = JSON.parse(response);
		console.log(events.length);
		for (let i = 0; i < events.length; i++) {
			var newEvent;
			newEvent = createEventBlock(events[i].event_name, events[i].ec_first_name, events[i].slots_remaining,  formatTime(events[i].start_time));
			formatTime(events[i].start_time)
			$('.eventsContainer').append(newEvent);
		}
	});
})

$(document).ready(function () {
	$('.eventBlock').click(function () {
		console.log("Redirect to respective Event Page Here");
	});
});
