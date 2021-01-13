(function($) {
    const storage = new Storage();
    const $alertArea = $( "#ctrn-alert" );
    RequestHandler = {
        API_BASE_URL: "http://greenvelvet.alwaysdata.net/kwick/api/",
        //genère la requête pour la parti publique de l'api
        publicRequestGenerator: (action) => {
            let site_entry = RequestHandler.API_BASE_URL.concat(action, '/');
            let password = $(`#password-${action}`).val();
            let username = $(`#username-${action}`).val(); 
            let backend_request = site_entry.concat(username, '/',password);
    
            return {
                "username": username,
                "request": backend_request
            };
        },

        //Gère l'envoie des requêtes 
        requestHandler: (req, reload_page, success, failure) => {
            if($.Constants.DEV)
                console.log(req);

            $.getJSON( req, {
                dataType: "jsonp",
            }).done(( data ) => {

                if($.Constants.DEV)
                    console.log(data);

                if( data.result.status === "failure") {
                    storage.logoutHandler();
                    $alertArea.addClass("alert alert-danger").text(data.result.message);
                }else {
                    success(data);
                }
            }).fail((data) => {

                if($.Constants.DEV)
                    console.log(data);
                failure(data);

            }).always(() => {  
                //refraichissement de la page 
                if(reload_page)
                    location.reload();
            });
        },

        //Gère l'envoie des requêtes publics
        publicSideHandler: (action, err_msg ) => {
            //ecoute sa soumission du formulaire
            $(`#form-${action}`).submit(function (event) {
                let middleware = RequestHandler.publicRequestGenerator(action);//weird
                if(action === "signup")
                    err_msg = middleware.username.concat(" ", err_msg);

                //envoie de la requêtes
                RequestHandler.requestHandler(middleware.request, false,
                (data) => { 
                    storage.loginHandler(data.result.id, middleware.username, data.result.token);
                    //Besoin de reload seulement en cas de succes
                    location.reload();
                },
                (data) => {
                    $( "span" ).addClass("failure").text(err_msg).show().fadeOut( 3000 );
                });

                event.preventDefault();
            });
        },

        //Met en place l'action: déconnexion
        setLogout: () => {
            const $logout = $('#logout');
            $logout.click(() => {                                  
                let lougout_request = RequestHandler.API_BASE_URL.concat("logout", "/", $.Constants.TOKEN, '/', $.Constants.USER_ID );
                RequestHandler.requestHandler(
                    //requête
                    lougout_request, 
                    //page reload
                    true,
                    //done
                    (data) => { 
                        storage.logoutHandler();
                    },
                    //fail
                    (data) => {
                        $alertArea.addClass("alert alert-danger").text(err_msg);
                    }
                );
            });
        },

        //Met en place l'action: say
        setSay: () => {
            $("#form-say").submit(function (event) {
                //recuperation du message aka tweet
                let msg = $("#msg").val(); 
                let backend_request = RequestHandler.API_BASE_URL.concat("say", "/",$.Constants.TOKEN, '/', $.Constants.USER_ID, '/', encodeURI(msg));

                RequestHandler.requestHandler(
                    //requête
                    backend_request, 
                    //page reload
                    true,
                    //done
                    (data) => { 
                        $alertArea.addClass("alert alert-success").text("Vos belles paroles ont été transmises avec succès !" ).show().fadeOut( 3000 );
                    },
                    //fail
                    (data) => {
                        $alertArea.addClass("alert alert-failure").text("Message n'a pas pu être posté" ).show().fadeOut( 3000 );
                    }
                );
                event.preventDefault();
            });
        },

        //Charge tous les utilisateurs connectés
        getLoggedUsers: (callback_success) => {
            let backend_request = RequestHandler.API_BASE_URL.concat("user/logged/", $.Constants.TOKEN);

            RequestHandler.requestHandler(
                //requête
                backend_request, 
                //page reload
                false,
                //done
                (data) => { 
                    callback_success(data.result.user);
                },
                //fail
                (data) => {
                    //jamais trigger ?
                    $alertArea.addClass("alert alert-failure").text("Personne n'est connecté !" ).show().fadeOut( 3000 );
                }
            );
        },
        
        // Charge tous les messages
        getMessage: (callback_success, timestamp) => {
            //comportement par default
            if( typeof(timestamp) == 'undefined' ){
                timestamp = 0;
            }
            //msg list
            let msg_request = RequestHandler.API_BASE_URL.concat("talk/list/", $.Constants.TOKEN, '/', timestamp);
            RequestHandler.requestHandler(
                //requête
                msg_request, 
                //page reload
                false,
                //done
                (data) => { 
                    callback_success(data.result.talk);
                },
                //fail
                (data) => {
                    //jamais trigger ?
                    $alertArea.addClass("alert alert-failure").text("Aucun message trouvé !" ).show().fadeOut( 3000 );
                }
            );
        }
    }
})(jQuery);
