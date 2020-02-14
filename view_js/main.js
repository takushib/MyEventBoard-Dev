function createEventBlock(eventName, creatorName, slotsRemaining, containerClass)
{
	var newEvent = $('<span></span>');
	
	var newEventName = $('<div><text></text></div>');
	var eventNameText = eventName;
	
	var newEventIcon = $('<div><img src="./icon.png"></img></div>');
	
	
	var newEventCreator = $('<div><text></text></div>');
	var creatorText = "Creator: ";
	creatorText = creatorText + creatorName;
	
	
	var newEventAvailSlot = $('<div><text></text></div>');
	var slotsText = "Slots: ";
	slotsText = slotsText + slotsRemaining + " remaining";
	
	newEventName.text(eventNameText);
	newEventName.addClass("eventBlockName");
	
	newEventIcon.addClass("eventIcon");
	
	newEventCreator.text(creatorText);
	newEventCreator.addClass("eventBlockCreator");
	
	newEventAvailSlot.text(slotsText);
	newEventAvailSlot.addClass("eventBlockSpace");
	
	newEvent.append(newEventName);
	newEvent.append(newEventIcon);
	newEvent.append(newEventCreator);
	//newEvent.append(newEventAvailSlot);
	
	
	newEvent.addClass("eventBlock");
	$(containerClass).append(newEvent);
}

$(document).ready(function () {
	
	createEventBlock("Test Event", "MyEventBoard Co.", "10",   ".eventsContainer");
	createEventBlock("CS 392 Recitation", "CS 392 TA", "1",    ".eventsContainer");
	createEventBlock("Uploaded Event", "MyEventBoard Co.", "3",".eventsContainer");
	createEventBlock("Party Night", "Jake Farst", "5",         ".eventsContainer");
	
})