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
    this.lanzarVotacion = function(){
        this.socket.emit("lanzarVotacion", this.codigo, this.nick);
    }
    this.saltarVoto = function(){
        this.socket.emit("saltarVoto", this.codigo, this.nick);
    }
    this.votar = function(){
        this.socket.emit("votar", this.codigo, this.nick, sospechoso);
    }
    this.obtenerEncargo = function(){
        this.socket.emit("obtenerEncargo", this.codigo, this.nick)
    }
    //final votacion
    //cuantos han votado
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
            if(data.codigo != "fallo"){
                cw.mostrarEsperandoRival();
            }else{
                cw.mostrarCrearPartida();
            }
        });
        this.socket.on("unidoAPartida", function(data){
            cli.codigo = data.codigo;
            console.log(data);
            if(data.codigo != "fallo"){
                cw.mostrarEsperandoRival();
            }else{
                cw.mostrarUnirAPartida();
            }
        });
        this.socket.on("acabaPartida", function(data){
            console.log(data);
        });
        this.socket.on("nuevoJugador",function(nick){
            console.log(nick+" se une a la partida");
        });
        this.socket.on("partidaIniciada",function(fase){
            console.log("Iniciar la fase: "+fase);
        });
        this.socket.on("hasAtacado",function(nick){
            console.log(nick);
        });
        this.socket.on("votacionLanzada",function(data){
            console.log(data);
        });
        this.socket.on("recibirListaPartidas",function(partidas){
            console.log(partidas);
        });
        this.socket.on("recibirListaPartidasDisponibles",function(partidas){
            console.log(partidas);
            cw.mostrarUnirAPartida(partidas);
        });
        this.socket.on("finalVotacion",function(data){
            console.log(data);
        });
        this.socket.on("haVotado",function(data){
            console.log(data);
        });
        this.socket.on("recibirEncargo", function(data){
            console.log(data);
        })
    }
    this.ini();
}
var ws2, ws3, ws4;
function pruebas(){
    // var ws1 = new ClienteWS();
    ws2 = new ClienteWS();
    ws3 = new ClienteWS();
    ws4 = new ClienteWS();
    var codigo = ws.codigo;

    ws2.unirAPartida(codigo, "juan");
    ws3.unirAPartida(codigo, "juani");
    ws4.unirAPartida(codigo, "juana");

    ws.iniciarPartida();

}