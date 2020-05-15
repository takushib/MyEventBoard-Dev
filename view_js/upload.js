$('#submitFile').on('click', function () {

    var inputFile = $('#inputFile');

    if (!$('#inputFile').val()) {
        alert('Please Upload File');
    }
    else {

        var eventName = document.getElementById('eventName').textContent;
        var file_data = $('#inputFile').prop('files')[0];
        var form_data = new FormData();

        form_data.append('file', file_data);
        form_data.append('slotKey', previous_slot);
        form_data.append('eventName', eventName);

        $.ajax({
            url: 'upload.php', // point to server-side PHP script
            dataType: 'text',  // what to expect back from the PHP script, if anything
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: "POST"
        }).done(function (response) {
            alert(response);
            previous_slot = null;
        });

    }

})
