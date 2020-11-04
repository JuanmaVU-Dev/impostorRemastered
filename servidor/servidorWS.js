modelo = require('./modelo.js');

function ServidorWS(){

    this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }

    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }

    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };


    this.lanzarSocketSrv = function(io, juego){
        var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero) {
		        console.log('usuario nick: '+nick+" crea partida numero: "+numero);
		        var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,usr);		        				
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo})		        		        
            });
            socket.on('unirAPartida', function(codigo, nick) {
                //nick o codigo nulo
                var res = juego.unirAPartida(codigo, nick);
                socket.join(codigo);
                var owner = juego.partidas[codigo].nickOwner;
                console.log('usuario nick: '+nick+" se une a partida: "+codigo);
                cli.enviarRemitente(socket, "unidoAPartida", {"codigo" : codigo,"owner": owner});
                cli.enviarATodosMenosRemitente(socket, codigo, "nuevoJugador",nick)
            });
            socket.on('iniciarPartida', function(codigo, nick) {
                //ToDO
                //comprobar si nick es owner
                //cli.enviarATodos(socket)
		    });
		});
    }
}

module.exports.ServidorWS = ServidorWS;