const daysOfWeek = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function createEventBlock(eventName, eventDate, creatorName, slotsRemaining, eventTime, eventLocation)
{
	//console.log(eventDate);
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
	var locationOfEvent = $('<div><text></text></div>');

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

	locationOfEvent.text(eventLocation);
	locationOfEvent.addClass("eventBlockSpace");
	locationOfEvent.addClass("Container");
	
	timeOfEvent.text(eventTime);
	timeOfEvent.addClass("eventBlockSpace");
	timeOfEvent.addClass("Container");

	var eventInfo = $('<div></div>');
	eventInfo.append(locationOfEvent);
	eventInfo.append(timeOfEvent);
	eventInfo.addClass("container infoHolder");
	
	//newEventAvailSlot.text(slotsText);
	//newEventAvailSlot.addClass("eventBlockSpace");

	titleContainer.append(newEventName);
	titleContainer.append(newEventIcon);
	//newEvent.append(newEventName);
	//newEvent.append(newEventIcon);
	newEvent.append(titleContainer);
	newEvent.append(newEventCreator);
	newEvent.append(eventInfo);
	//newEvent.append(newEventAvailSlot);


	newEvent.addClass("eventBlock");
	return newEvent;
}

function buildContainer(events, todaysDate)
{
	console.log(events);
	var newEvent;
	var weekEventsContainer = $('.weeksEvent');
	
	var eventContainer = $('<div></div>');
	
	if (formatDate(events[0].start_time) == todaysDate)
	{
		eventContainer.addClass("todayContainerStyle");
	}
	eventContainer.addClass("containerStyle");
	

	
	eventContainer.addClass("container");
	
	
	var date = new Date(formatDate(events[0].start_time));
	
	var dayName = daysOfWeek[date.getDay()];
	
	var dateHeader = $('<h2></h2>');
	dateHeader.addClass("dateHeader");
	
	dateHeader.text(dayName + " " + formatDate(events[0].start_time));
	
	var dayEventContainer = $('<div></div>');
	dayEventContainer.addClass("eventsContainer container");
	
	for (let i = 0; i < events.length; i++)
	{
		newEvent = createEventBlock(events[i].event_name, formatDate(events[i].start_time), events[i].ec_first_name, events[i].slots_remaining,  formatTime(events[i].start_time), events[i].event_location);
		dayEventContainer.append(newEvent);
	}
	
	eventContainer.append(dateHeader);
	eventContainer.append(dayEventContainer);
	
	weekEventsContainer.append(eventContainer);
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

function formatDate(date) {
	var dateYear = date.slice(0,4);
	
	var dateDay = date.slice(8, 10);
	dateDay = dateDay.replace(/^0+/, '') //truncate leading 0's
	
	var dateMonth = date.slice(5,7);
	dateMonth = dateMonth.replace(/^0+/, '')
	
	return dateMonth + "/" + dateDay + "/" + dateYear;
}

function getDate(dateObj) {
	var twoDigitMonth = ((dateObj.getMonth().length+1) === 1)? (dateObj.getMonth()+1) :(dateObj.getMonth()+1);	
	return twoDigitMonth + "/" + dateObj.getDate() + "/" + dateObj.getFullYear(); //return MM/DD/YYYY

}


function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getSunday(mondayObj) {
    mondayObj.setDate(mondayObj.getDate() + 6);
	return mondayObj;
}

function isInBetween(currDate, minDate, maxDate)
{
		var curr = new Date(currDate);
		var min = new Date(minDate);
		var max = new Date(maxDate);
		
		if (curr >= min && curr <= max ){
			return true;
		}
		else 
			return false;
 
}

function noEvents()
{
	$('.weeksEvent').append(('<div><h2> No Upcoming Events for this Week </h2></div>'));
}

$(document).ready(function () {
	var fullDate = new Date();
	var tempDayHolder = [];
	var curDay = "";
	var tempDay;
	var minWeekDate;
	var maxWeekDate;
	var isThereEvents = false;
	
	$('.todaysDate').text("Today's Date:  "+ daysOfWeek[fullDate.getDay()] +"  "+ getDate(fullDate) +" ");
	
	var events;
	$.ajax({
		url: "fill_dashboard.php",
		type: "POST",
		data: { userONID: myONID },
	}).done(function(response) {
		events = JSON.parse(response);
		
		if (events.length < 1)
		{	
			noEvents();
			return;
		}
		
	    curDay = formatDate(events[0].start_time);
		
		minWeekDate = getDate(getMonday(new Date()));
		maxWeekDate = getDate(getSunday(getMonday(new Date())));
	
		
		for (let i = 0; i < events.length; i++) {
			
			if (isInBetween(formatDate(events[i].start_time), minWeekDate, maxWeekDate) == false)
			{
				continue;
			}
			
			if (curDay == formatDate(events[i].start_time))
			{
				tempDayHolder.push(events[i]);
			}
			else
			{
				if (tempDayHolder.length > 0)
				{
					buildContainer(tempDayHolder, getDate(new Date()));
					isThereEvents = true;
				}
				tempDayHolder = [];
				curDay = formatDate(events[i].start_time);
				tempDayHolder.push(events[i]);
			}

		}
		if (tempDayHolder.length > 0) {
			buildContainer(tempDayHolder, getDate(new Date()));
			isThereEvents = true;
		}
		
		if (isThereEvents == false)
		{	
			noEvents();
			return;
		}

		
	});
})

$(document).ready(function () {
	$('.eventBlock').click(function () {
		console.log("Redirect to respective Event Page Here");
	});
});
