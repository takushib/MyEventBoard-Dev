const daysOfWeek = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


// Uses 12 hour format. AM and PM captialized.
function checkTimeIfLessThanToday(timeToBeChecked, todaysTime) {
	
	if (!((timeToBeChecked.includes("AM") || timeToBeChecked.includes("PM") || todayTimeStamp.includes("PM") || todayTimeStamp.includes("AM"))))
	{	
		alert("incorrect arguments");
		return false;
	}
	
	
	var checkedArrayHour = timeToBeChecked.split(":");
	var todayArrayHour = todaysTime.split(":");
	
	var checkedMinutesArray = checkedArrayHour[1].split(" ");
	var todayMinutesArray = todayArrayHour[1].split(" ");
	
	if (checkedMinutesArray[0].charAt(0) == '0')
		checkedMinutesArray[0] = checkedMinutesArray[0].replace('0','');
	
	if (todayMinutesArray[0].charAt(0) == '0')
		todayMinutesArray[0] = todayMinutesArray[0].replace('0','');
	
	if (checkedMinutesArray[1] == 'PM' & checkedArrayHour[0] != "12")
		checkedArrayHour[0] = checkedArrayHour[0] + 12;
	
	if (todayMinutesArray[1] == 'PM' & todayArrayHour[0] != "12")
		todayArrayHour[0] = todayArrayHour[0] + 12;
	
	
	var checkTime = parseInt(checkedArrayHour[0]) * 60 + parseInt(checkedMinutesArray[0]);
	var todayTime = parseInt(todayArrayHour[0]) * 60 + parseInt(todayMinutesArray[0])
	

	if (checkTime < todayTime)
		return true;
	else
		return false;
	
}


function getCurrentTime() {
   
		var date = new Date();
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var AM_PM = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    
        time = hours + ":" + minutes + " " + AM_PM;
        return time;
};

function createEventBlock(eventName, eventDate, creatorName, slotsRemaining, eventTime, eventLocation)
{
	//console.log(eventDate);
	var titleContainer = $('<div></div>');
	titleContainer.addClass("titleContainer");

	var newEvent = $('<div></div>');

	var newEventName = $('<div><text></text></div>');
	var eventNameText = eventName;

	//var newEventIcon = $('<div><img src="./icon.png"></img></div>');
	var newEventIcon = $('<div><img src="MyEventBoardLogos/MEB_logo-04.png"></img></div>');

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
	
	
	var date = new Date();
	var todayTimeStamp = getCurrentTime();
	
	if (checkTimeIfLessThanToday(eventTime, todayTimeStamp) == true && getDate(date) === eventDate) {
		newEvent.addClass("finishedEvent");
	}
	
	return newEvent;
}

// Input takes a object with start date and end Date (Format: yyyy-mm-dd hh:mm)
function databaseDateFormatToReadable(databaseDateObj) {
	var timeInfo = databaseDateObj.start_time.split(' ');
	var endTimeInfo = databaseDateObj.end_time.split(' ');
		
	var dateValue = timeInfo[0];
	var timeValue = timeInfo[1];
		
	var datePieces = dateValue.split("-");
		
	datePieces[2] = datePieces[2]; //Remove leading 0's by casting to integer
	var month = datePieces[1]; // save month to get correct month and day
	datePieces[1] = datePieces[1] - 1; //day name for object month is off by 1;
		
	var dateObj = new Date(datePieces[0], datePieces[1], datePieces[2]);
	
	return formatedDateObject = {
		year: datePieces[0],
		month: month,
		day: datePieces[2],
		startTime: timeValue,
		endTime: endTimeInfo[1]
	}
}


function buildContainer(events)
{
	//console.log(events);
	var newEvent;
	var weekEventsContainer = $('.weeksEvent');
	
	var eventContainer = $('<div></div>');
	
	var	timeObj = databaseDateFormatToReadable(events[0]);
	
	var eventDateObj = new Date(timeObj.year, timeObj.month-1, timeObj.day, 0, 0, 0, 0);
	
	var todaysDate = new Date();
	todaysDate.setHours(0,0,0,0);
	
	if (todaysDate.getDate() === eventDateObj.getDate())
	{
		eventContainer.addClass("todayContainerStyle");
	}
	else if (eventDateObj.getDate() < todaysDate.getDate()) {
			
		eventContainer.addClass("finishedEvent");
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
		data: {},
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
					buildContainer(tempDayHolder);
					isThereEvents = true;
				}
				tempDayHolder = [];
				curDay = formatDate(events[i].start_time);
				tempDayHolder.push(events[i]);
			}

		}
		if (tempDayHolder.length > 0) {
			buildContainer(tempDayHolder);
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
	
	$('#homeNav').addClass('activeNavItem');
	
	$('.eventBlock').click(function () {
		console.log("Redirect to respective Event Page Here");
	});
});
