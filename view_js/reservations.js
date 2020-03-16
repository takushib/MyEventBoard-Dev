const eventDateIndex = 3;
const dateStringLength = 11;
const eventNameIndex = 0;

function createPastEventsTable(dateRow, columnNames) {
	
	if (dateRow.length == 0)
		return;
	
	var rowItemCount = columnNames.length;
	
	var container = $('.entryField1');
	
	var pastEvents = $('<div></div>');
	pastEvents.addClass('pastEventsContainer');
	pastEvents.append('<h2> Past Events </h2>');
	
	
	var table = $('<Table></Table>');
	table.addClass('table pastEventsTable table-striped');
	
	var rowHeader = $('<tr></tr>');
	rowHeader.attr("scope", "row");

	
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

		var newDate = $(this).text().replace(/-/g, "/");
		
		var dateStrs = newDate.split(" ");

		
		var dt=new Date(dateStrs[0]);
		
		
		var timeStrs = dateStrs[1].split(":");
 
		dt.setHours(timeStrs[0]);
		dt.setMinutes(timeStrs[1]);
		dt.setSeconds(timeStrs[2]);
		
		
		
		if (dt < curDate) {
			var linkToPastEvent = $(this).parent().children().eq(eventNameIndex).children();
			linkToPastEvent.removeAttr("href");
			dateRow.push($(this).parent());	
			$(this).parent().remove();
		}
	});
	
	createPastEventsTable(dateRow, columnNames);
});
