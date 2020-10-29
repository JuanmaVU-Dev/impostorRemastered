var fs = require("fs");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var modelo = require("./servidor/modelo.js");


app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var juego = new modelo.Juego();

// /nombre-ruta-api/:param1/:param2/:...

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); 
    
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});

app.get('/nuevoUsuario/:nick',function(request, response){
    var nick = request.params.nick;
    var usuario = new modelo.Usuario(nick);
});

app.get('/crearPartida/:nick/:numero',function(request, response){
    var nick = request.params.nick;
    var usuario = new modelo.Usuario(nick);
    var num = parseInt(request.params.numero);
    //ojo nick nulo o numero nulo
    codigo = juego.crearPartida(num,usuario);
    response.send({"codigo": codigo});
});

app.get('/unirAPartida/:codigo/:nick',function(request, response){
    var nick = request.params.nick;
    var codigo = request.params.codigo;
    var res = juego.unirAPartida(codigo,nick)
    response.send({"res":res});
});

app.get('/listaPartidas',function(request, response){
    var listaPartidas = juego.listaPartidas();
    response.send(listaPartidas);
});

server.listen(app.get('port'), function () {
    console.log('Node esta escuchando en el puerto', app.get('port'));
});
