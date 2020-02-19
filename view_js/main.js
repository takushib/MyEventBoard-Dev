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

$(document).ready(function () {
	
	createEventBlock("Test Event",        "MyEventBoard Co.",    "10", "5:00 PM");
	
	$('.eventsContainer').append(newEvent); 
	
	var newEvent;
	
	newEvent = createEventBlock("CS 392 Recitation", "CS 392 TA",           "1",  "6:30 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Uploaded Event",    "MyEventBoard Co.",    "3",  "2:20 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Party Night",       "Jake Farst",          "5",  "1:15 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Party Night that's fun for tonight but it's ",       "Jake Farst",  "5",  "1:15 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Party Night that's fun for tonight but it's ",       "Jake Farst",  "5",  "1:15 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Party Night that's fun for tonight but it's ",       "Jake Farst",  "5",  "1:15 PM");
	$('.eventsContainer').append(newEvent); 
	newEvent = createEventBlock("Party Night that's fun for tonight but it's ",       "Jake Farst",  "5",  "1:15 PM");
	newEvent.addClass("finishedEvent");
	$('.eventsContainer').append(newEvent); 
})

$(document).ready(function () {
	$('.eventBlock').click(function () {
		console.log("Redirect to respective Event Page Here");
	});
})
