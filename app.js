var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require ('mongoose');
require("dotenv").config();
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
let WebSocket = require('ws');
let WebSocketServer = WebSocket.Server;
const Door = require('./models/Door');
const moment = require('moment');

var port = null;

(async () => {
  try {
    console.log(process.env.MDB)
    // Connexion à la base de données MongoDB
    await mongoose.connect(process.env.MDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Si la connexion réussit
    console.log('Connexion à MongoDB réussie');


  } catch (error) {
    // En cas d'échec de connexion
    console.error('Erreur de connexion à MongoDB :', error.message);
    //lever une exception
    throw new Error('Impossible de se connecter à la base de données MongoDB', error);
  }
})();

port = new SerialPort( {
  path: '/dev/ttyACM0',
  baudRate: 9600,
  baudRate:9600, dataBits:8,
  parity:'none', stopBits:1, flowControl:false,
} );

port.on('open', function () {
  setTimeout(() => {
    port.write('message', function(err) {
        if(err){
            return console.error(err.message);
        }
    })
  }, 10000 );
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

parser.on( 'data', data => {
    sendToClient(data);
} );

// Etablir le port pour le websocket
const SERVER_PORT = 8083;
let connections = new Array;  // Liste de connections au websocket
let wss = new WebSocketServer({port: SERVER_PORT}); // Le serveur webSocket

wss.on('listening', () => {
  console.log(`WebSocket server is listening on port ${SERVER_PORT}`);
});

wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
});

wss.on('connection', handleConnection);

function handleConnection(client) {
    connections.push(client); // Ajouter a la communication de l'array
  
    client.on('message', sendToSerial); // Quand un client envoie un message, envoier au serial
  
    client.on('close', function() { // Quand le client ferme sa connectionwhen a client closes its connection
      let position = connections.indexOf(client); // Obtenir la position du client dans l'array
      connections.splice(position, 1); // Et le supprimer
    });
}

/**
 * Envoyer un message au serial
 * @param {*} data 
 */
function sendToClient(data) {
    console.log("sending to serial: " + data);
    saveInDoorsCollection( data );
    // Envoyer message aux clients
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

}

/**
 * Envoyer un message au serial pour Arduino
 * @param {*} data
 */
function sendToSerial( data ) {
  console.log('send!', data.toString());
  port.write(data.toString());
}

function saveInDoorsCollection( data ) {
  let date = moment();//.subtract('4', 'day');
  const newData = new Door({ id_door:   (data), enter: true, date: date.toISOString() });
    newData.save()
    .then(() => {
      console.log('Données enregistrées avec succès dans la base de données.');
    })
    .catch((error) => {
      console.error('Erreur lors de l\'enregistrement des données dans la base de données :', error);
    });
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
