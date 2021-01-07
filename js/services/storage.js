class Storage {
    constructor(){
        // nom de l'objet storé pour cette application
        this.storageName = 'kwick-frontend-project-2020';
        let storedData = window.localStorage[this.storageName];
        // si localStorage inéxistant (instancié pour la première fois sur le navigateur)
        if(!storedData) {
            // on initialise l'objet de storage et les propriétés qu'on aura besoin
            // de récupérer et/ou de mofifier
            window.localStorage[this.storageName] = JSON.stringify({
                id: false, //initialisation id de l'utilisateur
                username: false,
                token: false // initialisation token de l'utilisateur
            });
        } 
    }

    get() {
        return JSON.parse(window.localStorage[this.storageName]);
    }

    set(data) {
        window.localStorage[this.storageName] = JSON.stringify(data);
    }

    setItem(key, value) {
        const data = this.get();
        data[key] = value;
        window.localStorage[this.storageName] = JSON.stringify(data);
    }
    removeItem(key) {
        const data = this.get();
        console.log(this);
        data.splice(key);
    }

    clear() {
       //à coder
    }
    loginHandler(id, username, token) {
        let data = this.get();
        data.id = id;
        data.username = username;
        data.token = token;

        //ecriture de la session
        this.set(data);
        //refraichissement de la page 
        location.reload();
    }
    // useless ? a tester
    logoutHandler() {
        let data = this.get();
        data.id = false;
        data.token = false;

        //supression de la session
        this.set(data);
        //refraichissement de la page 
        location.reload();
        
    }
}
