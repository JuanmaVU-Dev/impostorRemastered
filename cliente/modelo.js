function Juego(){
	this.partidas={}; 
	this.crearPartida=function(num, owner){
		let codigo = this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo] = new Partida(num,owner.nick);
			owner.partida = this.partidas[codigo];
		}
		return codigo;
	}
	this.unirAPartida = function(codigo, nick){
		if(this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let letras = cadena.split('');
		let maxCadena = cadena.length;
		let codigo = [];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
}

function Partida(num, owner){
	this.maximo = num;
	this.nickOwner = owner;
	this.fase = new Inicial();
	this.usuarios = {} 
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this);
	}
	this.puedeAgregarUsuario=function(nick){
			let nuevo = nick;
			let contador = 1;
			while(this.usuarios[nuevo]){
				nuevo = nick + contador;
				contador = contador + 1;
			}
			this.usuarios[nuevo] = new Usuario(nuevo);
	}
	this.comprobarMinimo = function(){
		return Object.keys(this.usuarios).length >= 4;
	}
	this.comprobarMaximo = function(){
		return Object.keys(this.usuarios).length <= 10;
	}
	this.iniciarPartida = function(){
		this.fase.iniciarPartida(this);
	}
	this.abandonarPartida = function(nick){
		this.fase.abandonarPartida(nick, this);
	}
	this.eleminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.agregarUsuario(owner);
}

function Inicial(){{}
	this.nombre = "Inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eleminarUsuario(nick);
		//comprobar si no quedan usuarios
	}
}

function Completado(){
	this.nombre = "Completado";
	this.agregarUsuario=function(nick,juego){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida= function(partida){
		partida.fase = new Jugando();
	}
	this.abandonarPartida=function(nick,partida){
		delete partida.usuarios[nick];
		partida.fase = new Inicial();
	}
}
function Jugando(){
	this.nombre = "Jugando";
	this.agregarUsuario=function(nick,juego){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		//eliminar el usuario y comprobar si no quedan usuarios
	}
}
function Final(){
	this.nombre = "Final";
	this.agregarUsuario=function(nick,juego){
		console.log("La partida ya ha terminado");
	}
	this.iniciarPartida=function(partida){
	}
	this.abandonarPartida=function(nick,partida){
		//esto es absurdo
		//eliminar el usuario y comprobar si no quedan usuarios
	}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego = juego;
	this.partida;
	this.crearPartida = function(num){
		return this.juego.crearPartida(num, this);
	}
	this.iniciarPartida = function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida = function(){
		this.partida.abandonarPartida(nick);
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}