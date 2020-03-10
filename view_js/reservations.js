$(document).ready(function () {
	
	var test = $('#selectInvite').click(function() { 
		$.ajax({
			url:"/php/get_slots.php",
			type: "POST",
			data: {fk_event: "18"},
		}).done(function(response) {
			alert(response);
		});
    });

});

$(document).ready(function () {
	$('#reserveNav').addClass('activeNavItem');
});