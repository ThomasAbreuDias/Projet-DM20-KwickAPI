(function($) {
    const storage = new Storage();
    Router = {
        API_BASE_URL: "http://greenvelvet.alwaysdata.net/kwick/api/",
        //genère le lien pour l'api
        publicMidlewareGenerator: (action) => {
            let site_entry = Router.API_BASE_URL.concat(action, '/');
            let password = $(`#password-${action}`).val();
            let username = $(`#username-${action}`).val(); 
            let backend_request = site_entry.concat(username, '/',password);
    
            return {
                "username": username,
                "request": backend_request
            };
        },
        // ExpiredSessionHandler(msg){
        //     if(msg === "wrong token. Access denied"){
        //         $( "h1" ).addClass("failure").text("Votre session a expiré. Veuillez vous reconnecter").show();
        //         return false;
        //     }
        //     return true;
        // },
        // requete public 
        publicSideRequest: (action, err_msg ) => {
            //ecoute sa soumission du formulaire
            $(`#form-${action}`).submit(function (event) {
                let middleware = Router.publicMidlewareGenerator(action);//weird
                if(action === "signup")
                    err_msg = middleware.username.concat(" ", err_msg);

                //envoie de la requêtes
                $.getJSON( middleware.request, {
                    format: "jsonp"
                }).done(( data ) => {
                    //storage.js dependencie
                    let storage = new Storage();
                    storage.loginHandler(data.result.id, middleware.username, data.result.token);
                }).fail((data) => {
                    console.log(data);
                    $( "span" ).addClass("failure").text(err_msg).show().fadeOut( 3000 );
                });

                event.preventDefault();
            });
        },
        //setup Logout 
        setLogout: () => {
            const $logout = $('#logout');
            $logout.click(() => {                                  
                let lougout_request = Router.API_BASE_URL.concat("logout", "/", $.Constants.TOKEN, '/', $.Constants.USER_ID );
                $.getJSON( lougout_request, {
                    format: "jsonp"
                }).done((data) => {
                    console.log(data);
                    storage.logoutHandler();
                }).fail((data) => {
                    console.log(data);
                    $( "h1" ).addClass("failure").text("Deconnexion impossible").show().fadeOut( 3000 );
                });
            });
        },
        //set up say
        setSay: () => {
            $("#form-say").submit(function (event) {
                //recuperation du message aka tweet
                let msg = $("#msg").val(); 
                let backend_request = Router.API_BASE_URL.concat("say", "/",$.Constants.TOKEN, '/', $.Constants.USER_ID, '/', encodeURI(msg));
                console.log(backend_request);
                //envoie de la requêtes
                $.getJSON( backend_request, {
                    format: "jsonp"
                }).done((data) => {
                    console.log(data);
                    $( "span" ).addClass("success").text( $.Constants.USERNAME.concat("Vos belles paroles ont été transmises avec succès !") ).show().fadeOut( 3000 );
                }).fail((data) => {
                    console.log(data);
                    $( "span" ).addClass("failure").text( $.Constants.USERNAME.concat("Message n'a pas pu être posté") ).show().fadeOut( 3000 );
                });
                event.preventDefault();
            });
        },
        //charge tous les utilisateurs 
        getLoggedUsers: (callback_success) => {
            let backend_request = Router.API_BASE_URL.concat("user/logged/", $.Constants.TOKEN);
            //Recupère les utilisateurs connecté !
            $.getJSON( backend_request, {
                format: "jsonp"
            }).done(function( data ) {
                if( data.result.message === "wrong token. Access denied") {
                    storage.logoutHandler();
                    // location.reload();
                    $( "h1" ).addClass("failure").text("Votre session a expiré. Veuillez vous reconnecter").show();
                }else 
                    callback_success(data.result.user);

            }).fail(function(data) {
                console.log(data);
                $( "h1" ).addClass("failure").text("Personne n'est connecté !").show().fadeOut( 3000 );
            });
        },
        getMessage: (callback_success, timestamp) => {
            //comportement par default
            if( typeof(timestamp) == 'undefined' ){
                timestamp = 0;
            }
            //msg list
            let msg_request = Router.API_BASE_URL.concat("talk/list/", $.Constants.TOKEN, '/', timestamp);
            $.getJSON( msg_request, {
                format: "jsonp"
            }).done(( data ) => {
                if( data.result.message === "wrong token. Access denied") {
                    storage.logoutHandler();
                    $( "h1" ).addClass("failure").text("Votre session a expiré. Veuillez vous reconnecter").show();
                }else//afficher les messages
                    callback_success(data.result.talk);
            }).fail((data) => {
                console.log(data);
                $( "h1" ).addClass("failure").text("Personne n'est connecté !").show().fadeOut( 3000 );
                
            });
        }
    }
})(jQuery);
