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
    if (socket.readyState === WebSocket.OPEN) {
        socket.send('f');
    } else {
        console.error('La connexion WebSocket n\'est pas ouverte.');
    }
}

function ouvrir() {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send('o');
    } else {
        console.error('La connexion WebSocket n\'est pas ouverte.');
    }
}

setup();