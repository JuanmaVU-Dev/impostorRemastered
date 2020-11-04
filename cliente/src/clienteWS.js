function ClienteWS(){
    this.socket;
    this.crearPartida = function(nick, numero){
        this.socket.emit("crearPartida", nick, numero);
    }
    this.unirAPartida = function(codigo, nick){
        this.socket.emit("unirAPartida", codigo, nick);
    }
    this.iniciarPartida = function(nick, codigo){
        this.socket.emit("iniciarPartida",codigo, nick);
    }
    this.ini = function(){
        this.socket=io.connect();
        this.lanzarSocketSrv();    
    }
    //servidor WS dentor del cliente
    this.lanzarSocketSrv = function(){
        var cliente = this;
        this.socket.on('connect', function(){			
			console.log("Conectado al servidor de WS");
		});
        this.socket.on("partidaCreada", function(data){
            console.log(data);
        });
        this.socket.on("unidoAPartida", function(data){
            console.log(data);
        });
        this.socket.on("nuevoJugador",function(nick){
            console.log(nick+" se une a la partida");
        });
    }
}