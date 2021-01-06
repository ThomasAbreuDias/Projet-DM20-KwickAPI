// verification du coockie
if ( $.Constants.TOKEN !== false || $.Constants.TOKEN !== undefined ) {//si la session n'est pas initialisé correctement
    //Redirige l'utilisateur sur la page d'acceuil
    window.location.href = "html/backoffice.html";//page d'acceuil
}else{
    //write
    //sign up 
    $("#form-signup").submit(function (event) {
        let signup_entry = "http://greenvelvet.alwaysdata.net/kwick/api/signup/";
        //recuperation des champs
        let username = $("#signup-username").val(); 
        let password = $("#signup-password").val(); 
        let backend_request = signup_entry.concat(username, '/',password);
        //validation
        if ( $( "#confirm" ).val() !== password) {
            $( "span" ).addClass("failure").text( "Veillez à ce que les mots de passes soient identiques !" ).show().fadeOut( 3000 );
        }
        //envoie de la requêtes
        $.getJSON( backend_request, {
            format: "jsonp"
        }).done(( data ) => {
            let cookie = new Storage();
            cookie.loginHandler(data.result.id, username, data.result.token);
            //window.location.href = "../html/backoffice.html";//page utilisateur
        }).fail(() => {
            $( "span" ).addClass("failure").text( username.concat(" n'est pas disponible !") ).show().fadeOut( 3000 );
        });
        event.preventDefault();
    });

    //login
    $("#form-login").submit(function (event) {
        let login_entry = "http://greenvelvet.alwaysdata.net/kwick/api/login/";
        //recuperation des champs
        let username = $("#login-username").val(); 
        let password = $("#login-password").val(); 
        let backend_request = login_entry.concat(username, '/',password);

        //envoie de la requêtes
        $.getJSON( backend_request, {
            format: "jsonp"
        }).done(( data ) => {
            let cookie = new Storage();
            cookie.loginHandler(data.result.id, username, data.result.token);
            //window.location.href = "../html/backoffice.html";//page utilisateur
        }).fail(() => {
            $( "span" ).addClass("failure").text( username.concat("Identifiant ou mot de passe incorrect") ).show().fadeOut( 3000 );
        });
        event.preventDefault();
    });
}

