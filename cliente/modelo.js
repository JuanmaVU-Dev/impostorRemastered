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
	
	this.unirPartida() = function(){
	}
	
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let letras = cadena.split('');
		let codigo = [];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,25)-1]);
		}
		return codigo.join('');
	}
}

function Partida(num, owner){
	this.numUusuarios = num;
	this.owner = owner;
	this.usuarios = []; //el index 0 es owner
	//this.usuarios = {} //version array asociativo
	this.agregarUsuario=function(nick){
		//comprobar que el nick es unico
		//comprobar si el usuario num (maximo)
		
	}
	
	this.agregarUsuario(owner);
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

