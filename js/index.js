(function($) {
    global.initSession();
    //verifie si une session est en cour
    console.log($.Constants.TOKEN);
    if ( $.Constants.TOKEN !== false || $.Constants.TOKEN === undefined) {//si la session n'est pas initialisé correctement
        //Redirige l'utilisateur sur la page d'acceuil
        window.location.href = "html/backoffice.html";//page d'acceuil
    }
    //seting up sign up features
    Router.publicSideRequest("signup", " n'est pas disponible !");
    //seting up login features
    Router.publicSideRequest("login", "Identifiant ou mot de passe incorrect");
})(jQuery);


