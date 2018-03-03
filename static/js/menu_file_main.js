$(document).ready(function() {
    $('#menuForm').submit(function() {
        $(this).ajaxSubmit({
            error: function(response){
                console.log(response)
                alert(response.responseText)
            },
            success: function(response){
                alert(response.message);
            }
        });
        return false;
    });
});