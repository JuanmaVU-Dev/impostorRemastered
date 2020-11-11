function ClienteWS(){
    this.socket;
    this.nick = undefined;
    this.codigo = undefined;
    this.crearPartida = function(nick, numero){
        this.nick = nick;
        this.socket.emit("crearPartida", nick, numero);
    }
    this.unirAPartida = function(codigo, nick){
        this.nick = nick;
        this.socket.emit("unirAPartida", codigo, nick);
    }
    this.iniciarPartida = function(){
        this.socket.emit("iniciarPartida", this.codigo, this.nick);
    }
    this.listaPartidasDisponibles = function(){
        this.socket.emit("listaPartidasDisponibles");
    }
    this.listaPartidas = function(){
        this.socket.emit("listaPartidas");
    }
    this.atacar = function(nickAtacado){
        this.socket.emit("atacar", this.codigo, this.nick, nickAtacado);
    }
    this.ini = function(){
        this.socket=io.connect();
        this.lanzarSocketSrv();    
    }
    //servidor WS dentor del cliente
    this.lanzarSocketSrv = function(){
        var cli = this;
        this.socket.on('connect', function(){			
			console.log("Conectado al servidor de WS");
		});
        this.socket.on("partidaCreada", function(data){
            cli.codigo = data.codigo;
            console.log(data);
            pruebas();
        });
        this.socket.on("unidoAPartida", function(data){
            cli.codigo = data.codigo;
            console.log(data);
        });
        this.socket.on("nuevoJugador",function(nick){
            console.log(nick+" se une a la partida");
        });
        this.socket.on("partidaIniciada",function(fase){
            console.log("Iniciar la fase: "+fase);
        });
        this.socket.on("hasAtacado",function(nick){
            console.log("Has atacado a:"+nick);
        });
        this.socket.on("recibirListaPartidas",function(partidas){
            console.log(partidas);
        });
        this.socket.on("recibirListaPartidasDisponibles",function(partidas){
            console.log(partidas);
        });
    }
    this.ini();
}

function pruebas(){
    // var ws1 = new ClienteWS();
    var ws2 = new ClienteWS();
    var ws3 = new ClienteWS();
    var ws4 = new ClienteWS();
    var codigo = ws.codigo;

    ws2.unirAPartida(codigo, "juan");
    ws3.unirAPartida(codigo, "juani");
    ws4.unirAPartida(codigo, "juana");

    ws.iniciarPartida();

}