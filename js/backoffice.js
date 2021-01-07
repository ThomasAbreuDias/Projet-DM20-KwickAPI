(function($) {
    global.initSession();
    //verifie si la session est valide
    if ( $.Constants.TOKEN === false || $.Constants.TOKEN === undefined ) {//si la session n'est pas initialisé correctement
        //Redirige l'utilisateur sur la page d'acceuil
        window.location.href = "../index.html";

    } else {

        // Affiche les utilisateurs
        function renderUsers(users) {
            const $select = $('#user-select');        
            //Parcour tous les utilisateurs retourné par l'api
            $.each( users, function(key, val) {
                //ajoute les utilisateurs au select
                $select.append('<option value="'+val+'">'+val+'</option>');
            });  
        }

        //Affiche les messages
        function renderMessages(messages) {
            const $chatbox = $("#msg-timeline");
            $.each( messages, function(key, val) {
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

        //appel des fonctionss
        Router.setLogout();
        Router.setSay();
        Router.getMessage(renderMessages);
        Router.getLoggedUsers(renderUsers);
    }
})(jQuery);