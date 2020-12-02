function ClienteWS(){
    this.socket;
    this.nick = undefined;
    this.codigo = undefined;
    this.owner = false;
    this.numJugador;
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
    this.estoyDentro = function(){
        this.socket.emit("estoyDentro", this.codigo, this.nick);
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
    this.movimiento = function(direccion){
        this.socket.emit("movimiento", this.codigo, this.nick, this.numJugador);
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
                cli.owner = true;
                cli.numJugador = 0;
                cw.mostrarEsperandoRival();
            }
        });
        this.socket.on("unidoAPartida", function(data){
            cli.codigo = data.codigo;
            console.log(data);
            if(data.codigo != "fallo"){
                cw.mostrarEsperandoRival();
            }
        });
        this.socket.on("acabaPartida", function(data){
            console.log(data);
        });
        this.socket.on("nuevoJugador",function(lista){
            cw.mostrarListaJugadores(lista);
        });
        this.socket.on("esperando",function(fase){
            console.log("esperando...");
        });
        this.socket.on("partidaIniciada",function(fase){
            console.log("Iniciar la fase: "+fase);
            lanzarJuego();
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
        this.socket.on("dibujarRemoto",function(lista){
            console.log(lista);
            for(var i=0;i<lista.lenght;i++){
                lanzarJugadorRemoto(lista[i].nick, lista[i].numJugador);
            }
        });
        this.socket.on("moverRemoto",function(datos){
            console.log(lista);
            moverRemoto(datos.direccion, datos.nick, datos.numJugador);
        });
        this.socket.on("recibirListaPartidasDisponibles",function(partidas){
            console.log(partidas);
            if(!cli.codigo){
                cw.mostrarUnirAPartida(partidas);
            }
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