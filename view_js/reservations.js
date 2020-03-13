const eventDateIndex = 3;
const dateStringLength = 11;

function createPastEventsTable(dateRow, columnNames) {
	
	var rowItemCount = columnNames.length;
	
	var container = $('.entryField1');
	
	var pastEvents = $('<div></div>');
	pastEvents.addClass('pastEventsContainer');
	pastEvents.append('<h2> Past Events </h2>');
	
	
	var table = $('<Table></Table>');
	table.addClass('table pastEventsTable table-striped');
	
	var rowHeader = $('<tr></tr>');
	rowHeader.attr("scope", "row");
	
	
	/*
	var eventName = $('<th>Event Name</th>');
	eventName.attr("scope", "col");
	rowItemCount--;
	
	var startTime = $('<th>Start Time</th>');
	startTime.attr("scope", "col");
	rowItemCount--;
	
	
	rowHeader.append(eventName);
	rowHeader.append(startTime);
	*/
	
	var i = 0;
	
	while(i < rowItemCount) {
		var header = $('<th>'+columnNames[i]+'</th>');
		header.attr("scope", "col");
		rowHeader.append(header);
		i++;
	}
	

	
	
	var thead = $('<Thead></Thead>');
	thead.append(rowHeader);
	
	

	var tbody = $('<Tbody></Tbody>');
	
	for (let i = 0; i < dateRow.length; i++) {
		tbody.append(dateRow[i]);
	}
	
	table.append(thead);
	table.append(tbody);
	
	pastEvents.append(table);
	container.append(pastEvents);
}

$( document ).ready(function() {

	var columnNames = [];

	$('#invitesTable thead tr th').each(function(index) {
		columnNames.push($(this).html());  
	});

	
	var dateRow = [];
	var curDate = new Date();
	
	$("#invitesTable tr td:nth-last-child( "+ eventDateIndex +" )").each(function () {

	//	console.log($(this).text());
		//var date = $(this).text().slice(0,dateStringLength);
		//var time = $(this).text().slice(dateStringLength, $(this).text().length);
		
		
		
		var newDate = $(this).text().replace(/-/g, "/");
		
		var dateStrs = newDate.split(" ");
		
	//	console.log(newDate);
		
		var dt=new Date(dateStrs[0]);
		
		//console.log(time);
		//console.log(newDate);
		
		
		
		var timeStrs = dateStrs[1].split(":");
 
		dt.setHours(timeStrs[0]);
		dt.setMinutes(timeStrs[1]);
		dt.setSeconds(timeStrs[2]);
		
		
		
		if (dt < curDate) {
			dateRow.push($(this).parent());	
			$(this).parent().remove();
		}
	});
	
	createPastEventsTable(dateRow, columnNames);
});
