(function($) {
    global = {
        initSession: () => {
            var storage = new Storage();
            $.Constants = 
            {
                TOKEN: storage.get().token,
                USER_ID: storage.get().id,
                USERNAME: storage.get().username  
            }
        },
    
    }
})(jQuery);

