function uploadFile(fileData, eventName, slotKey) {

    var form_data = new FormData();

    form_data.append('file', fileData);
    form_data.append('eventName', eventName);
    form_data.append('slotKey', slotKey);

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
    });

}  