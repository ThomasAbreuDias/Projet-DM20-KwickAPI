if ( $.Constants.TOKEN === false || $.Constants.TOKEN === undefined ) {//si la session n'est pas initialisé correctement
    //Redirige l'utilisateur sur la page d'acceuil
    window.location.href = "../index.html";//page d'acceuil

} else {//Affiche Tous les utilisisateurs connecté 

    //logout
    const $logout = $('#logout');
    console.log($logout);
    $logout.click(() => {
        let lougout_request = "http://greenvelvet.alwaysdata.net/kwick/logout/".concat($.Constants.TOKEN, '/', $.Constants.USER_ID );
        $.getJSON( lougout_request, {
            format: "jsonp"
        }).done((data) => {
            console.log(data);
            cookie.logoutHandler();
        }).fail(() => {
            //no triggered, why ?
            $( "h1" ).addClass("failure").text("Deconnexion impossible").show().fadeOut( 3000 );
        });
    });

    let backend_request = "http://greenvelvet.alwaysdata.net/kwick/api/user/logged/".concat($.Constants.TOKEN);
    const $select = $('#user-select');
    const $chatbox = $("#msg-timeline");
    //Recupère les utilisateurs connecté !
    $.getJSON( backend_request, {
        format: "jsonp"
    }).done(( data ) => {
        //@bricolage ? je pense que oui
        if(data.result.status === "failure"){
            //Gestion du cas ou la session à expirer 
            if( data.result.message === "wrong $.Constants.TOKEN. Access denied"){
                cookie.logoutHandler();
                // location.reload();
                $( "h1" ).addClass("failure").text("Votre session a expiré. Veuillez vous reconnecter").show();
            }
        } else {
            
            //Parcour tous les utilisateurs retourné par l'api
            $.each( data.result.user, function(key, val) {
                //ajoute les utilisateurs au select
                $select.append('<option value="'+val+'">'+val+'</option>');
            });  
        }  

    }).fail(() => {
        //no triggered, why ?
        $( "h1" ).addClass("failure").text("Personne n'est connecté !").show().fadeOut( 3000 );
    });

    //say
    $("#form-say").submit(function (event) {
        let say_entry = "http://greenvelvet.alwaysdata.net/kwick/api/say/";
        //recuperation du message aka tweet
        let msg = $("#msg").val(); 
        let backend_request = say_entry.concat($.Constants.TOKEN, '/', $.Constants.USER_ID, '/', encodeURI(msg));
        console.log(backend_request);
        //envoie de la requêtes
        $.getJSON( backend_request, {
            format: "jsonp"
        }).done(() => {
            $( "span" ).addClass("success").text( $.Constants.USERNAME.concat("Vos belles paroles ont été transmises avec succès !") ).show().fadeOut( 3000 );
        }).fail(() => {
            $( "span" ).addClass("failure").text( $.Constants.USERNAME.concat("Message n'a pas pu être posté") ).show().fadeOut( 3000 );
        });
        event.preventDefault();
    });

    //msg list
    let timestamp = 0;
    let msg_request = "http://greenvelvet.alwaysdata.net/kwick/api/talk/list/".concat($.Constants.TOKEN, '/', timestamp);
    $.getJSON( msg_request, {
        format: "jsonp"
    }).done(( data ) => {
        //@bricolage ? je pense que oui
        //codeReapete
        if(data.result.status === "failure") {
            //Gestion du cas ou la session à expirer 
            if( data.result.message === "wrong token. Access denied") {
                cookie.logoutHandler();
                // location.reload();
                $( "h1" ).addClass("failure").text("Votre session a expiré. Veuillez vous reconnecter").show();
            }
        } else {
            
            //Parcour tous les messages
            $.each( data.result.talk, function(key, val) {
                //declare
                const date = new Date(val.timestamp*1000);
                let formated_date = date.toLocaleDateString("fr-FR");
                // construction du message
                let article = (val.user_name === $.Constants.USERNAME) ?  `<article id="msg-${key}" class="perso">` : `<article id="msg-${key}">`;
                    article += `<span>Ecrit par<span class="username">${val.user_name}</span>le <time datetime="${val.timestamp}">${formated_date}</time></span>`;
                    article += `<p>${val.content}</p></article>`;

                $chatbox.append(article);
            });  
        }  

    }).fail(() => {
        //no triggered, why ?
        $( "h1" ).addClass("failure").text("Personne n'est connecté !").show().fadeOut( 3000 );
    });
    
}
