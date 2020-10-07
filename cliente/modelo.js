function Juego(){
	this.partidas={}; //que coleccion usamos?
	this.crearPartida=function(num, owner){
		//generar codigo de 6 letras
		//comprobar que no esta en uso
		let codigo = this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo] = new Partida(num,owner);
		}
		//Crear el objeto partida: num, owner
		//this.partidas[] = nueva partida

	}
	
	this.unirAPartida = function(codigo, nick){
		if(this.partidas[codigo]){
			let partida = this.partidas[codigo];
			partida.agregarUsuario(nick);
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
	this.numUsuarios = num;
	this.nickOwner = owner;
	this.fase = new Inicial();
	this.agregarUsuario
	//this.usuarios = []; //el index 0 es owner
	this.usuarios = {} //version array asociativo
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this);
	}
	this.puedeAgregarUsuario=function(nick){
		//comprobar que el nick es unico
		//comprobar si el usuario num (maximo)
		if(this.numUsuarios > Object.keys(this.usuarios).length){
			let nuevo = nick;
			let contador = 1;
			while(this.usuarios[nuevo]){
				nuevo = nick + contador;
				contador = contador + 1;
			}
			this.usuarios[nuevo] = new Usuario(nuevo);
		}else{
			console.log("Numero de jugadores máximo alcanzado");
		}
	}
	
	this.agregarUsuario(owner);
}

function Usuario(nick){
	this.nick=nick;
}

function Inicial(){{}
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
	}
}
function Jugando(){
	this.agregarUsuario=function(nick,juego){
		//this.puedeAgregarUsuario(nick);
	}
}
function Final(){
	this.agregarUsuario=function(nick,juego){
		//this.puedeAgregarUsuario(nick);
	}
}
function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

