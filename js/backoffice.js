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
                //Met en evidance l'utilisateur connecté
                let list = (val === $.Constants.USERNAME) ? '<li class="list-group-item active"' : '<li class="list-group-item"';
                //ajoute les utilisateurs au select
                list += ' value="'+val+'">'+val+'</li>';

                $select.append(list);
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
                let article = (val.user_name === $.Constants.USERNAME) ? '<li class="list-group-item perso">' :' <li class="list-group-item">';
                article +=`<article id="msg-${key}">`;
                article += `<header class="header">
                                <strong class="username primary-font">${val.user_name}</strong>
                                <small><time datetime="${val.timestamp}">${formated_date}</time></small>
                            </header>`;
                article += `<p>${val.content}</p>`;
                article += '</article></li>';
                
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