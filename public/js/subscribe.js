$(document).ready(function () {
    $('#signUp').click(function () {
        $('#myModal').modal('toggle');
    });
    $('#submitFormClose').click(function () {
        $('#myModal').modal('hide');
        $('#blogSubscription').trigger('reset');
        $('#submitFormButton').prop("disabled", false);
        hideToast();
    });

    $('#blogSubscription').submit(function (event) {
        event.preventDefault();
        hideToast();
        var formData = $('#blogSubscription').serialize();
        $.ajax({
            url: "/subscription/signup"
            , data: formData
            , success: function (data) {
                if (data.success) {
                    $('#submitFormButton').prop("disabled", true);
                    $('#signUpSuccess').show();
                } else {
                    $('#signUpError').show();
                }
            }
        });
    });
    
    $('#unSubscribe').submit(function (event) {
        event.preventDefault();
        $('#unSubscribeSuccess').hide();
        $('#unSubscribeError').hide();
        var formData = $('#unSubscribe').serialize();
        $.ajax({
            url: "/subscription/unsubscribe"
            , data: formData
            , success: function (data) {
                if (data.success) {
                    $('#unSubscribeSuccess').show();
                }else {
                    $('#unSubscribeError').show();
                }
            }
        });
    });
    
    
    
    
    function hideToast(){
        $('#signUpSuccess').hide();
        $('#signUpError').hide();
    }
});