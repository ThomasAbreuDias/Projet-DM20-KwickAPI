(function($) {
    var cookie = new Storage();
    $.Constants = 
    {
        TOKEN: cookie.get().token,
        USER_ID: cookie.get().id,
        USERNAME: cookie.get().username
        
    } })(jQuery);