const socket = new WebSocket('ws://localhost:8083/');
/**
 * Initialiser fonctions pour websocket.
 */
function setup() {
    socket.onopen = openSocket;
    socket.onmessage = showData;
}

/**
 * Action quand le websocket a été ouvert
 */
function openSocket() {
    /**
     * toDo
     */
}
 
/**
 * Afficher données avec le message
 * @param {*} result: Message envoyé par le serveur 
 */
function showData(result) {
}

function fermer() {
}

function ouvrir() {
    
}

setup();