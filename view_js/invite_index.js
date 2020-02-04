$(document).ready(function () {
	
	var test = $('#selectInvite').click(function() { 
		console.log("hi");
		$.ajax({
			url:"slots.php",
			type: "POST",
			data: {fk_event: "18"},
		}).done(function(response) {
			alert(response);
		});
    });

});