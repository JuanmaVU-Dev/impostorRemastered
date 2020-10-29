function Juego() {
	this.partidas = {};
	this.crearPartida = function (num, owner) {
		//comprobar limites de num
		let codigo = "fallo";
		if (!this.partidas[codigo] && this.numeroValido(num)) {
			codigo = this.obtenerCodigo();
			this.partidas[codigo] = new Partida(num, owner.nick, codigo);
			owner.partida = this.partidas[codigo];
		}
		return codigo;
	}
	this.unirAPartida = function (codigo, nick) {
		var res = -1;
		if (this.partidas[codigo]) {
			this.partidas[codigo].agregarUsuario(nick);
			//numeroUsuario por ejemplo
		}
		return res;
	}
	this.obtenerCodigo = function () {
		let cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let letras = cadena.split('');
		let maxCadena = cadena.length;
		let codigo = [];
		for (i = 0; i < 6; i++) {
			codigo.push(letras[randomInt(1, maxCadena) - 1]);
		}
		return codigo.join('');
	}
	this.numeroValido = function (numero) {
		return numero >= 4 && numero <= 10;
	}
	this.eliminarPartida = function (codigo) {
		delete this.partidas[codigo];
	}
	this.listaPartidas = function(){
		var listaJSON = [];
		var huecos = 0;
		for(key in this.partidas){
			
		}
		return listaJSON;
	}
}

function Partida(num, owner, codigo) {
	this.maximo = num;
	this.nickOwner = owner;
	this.fase = new Inicial();
	this.codigo = codigo;
	this.usuarios = {}
	this.tareas = ["jardines", "calles", "mobiliario", "basuras"];
	this.agregarUsuario = function (nick) {
		this.fase.agregarUsuario(nick, this);
	}
	this.puedeAgregarUsuario = function (nick) {
		let nuevo = nick;
		let contador = 1;
		while (this.usuarios[nuevo]) {
			nuevo = nick + contador;
			contador = contador + 1;
		}
		this.usuarios[nuevo] = new Usuario(nuevo);
		this.usuarios[nuevo].partida = this;
	}
	this.comprobarMinimo = function () {
		return this.numeroDeJugadores() >= 4;
	}
	this.comprobarMaximo = function () {
		return this.numeroDeJugadores() <= this.maximo;
	}
	this.iniciarPartida = function () {
		this.fase.iniciarPartida(this);
	}
	this.puedeIniciarPartida = function () {
		this.fase = new Jugando();
		this.asignarTareas();
		this.asignarImpostor();
	}
	this.asignarTareas = function () {
		var keys = Object.keys(this.usuarios);
		for (i = 0; i < keys.length; i++) {
			this.usuarios[keys[i]].encargo = this.tareas[i % this.tareas.length];
		}
	}
	this.asignarImpostor = function () {
		var keys = Object.keys(this.usuarios);
		var usuarioAleatorio = keys[randomInt(0, keys.length)];
		this.usuarios[usuarioAleatorio].impostor = true;
	}
	this.abandonarPartida = function (nick) {
		this.fase.abandonarPartida(nick, this);
	}
	this.puedeAbandonarPartida = function (nick) {
		this.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()) {
			this.fase = new Inicial();
		}
	}
	this.eliminarUsuario = function (nick) {
		delete this.usuarios[nick];
	}
	this.numeroDeJugadores = function () {
		return Object.keys(this.usuarios);
	}
	this.agregarUsuario(owner);
	this.atacar = function (nickAtacado, atacante) {
		if (atacante.impostor) {
			this.fase.atacar(nick);
		}
	}
	this.puedeAtacar = function (nick) {
		this.usuarios[nick].esAtacado();
	}
	this.numeroImpostoresVivos = function () {
		let cont = 0;
		for (var key in Object.keys(this.usuarios)) {
			if (this.usuarios[key].impostor && this.usuarios[key].estado.nombre == "vivo") {
				cont++;
			}
		}
		return cont;
	}
	this.numeroCiudadanosVivos = function () { 
		let cont = 0;
		for (var key in Object.keys(this.usuarios)) {
			if (!this.usuarios[key].impostor && this.usuarios[key].estado.nombre == "vivo") {
				cont++;
			}
		}
		return cont;
	}

	this.gananImpostores = function () {
		let ganan = this.numeroImpostoresVivos >= this.numeroCiudadanosVivos;
		if(ganan) this.fase = new Final();
		return ganan;
	}
	this.gananCiudadanos = function () {
		return this.numeroImpostoresVivos == 0;
	}
	this.masVotado=function(){
		let max=0;
		var usr=undefined;
		for (var key in Object.keys(this.usuarios)) {
			if (this.usuarios[key].impostor.votos >= max && this.usuarios[key].estado.nombre=="vivo") {
				usr = this.usuarios[key];
			}
		}
	}
	this.numeroSkips=function(){
		let nSkips=0;
		var usr=undefined;
		for (var key in Object.keys(this.usuarios)) {
			if (this.usuarios[key].skip && this.usuarios[key].estado.nombre=="vivo") {
				nSkips++;
			}
		}
		return nSkips;
	}
	this.reiniciarContadores=function(){
		for (var key in Object.keys(this.usuarios)) {
			if (this.usuarios[key].estado.nombre=="vivo") {
				this.usuarios[key].votos = 0;
				this.usuarios[key].skip = false;
			}
		}
	}
	this.huecos = function(){
		return this.maximo-this.numeroDeJugadores();
	}

}

function Inicial() {
	this.nombre = "Inicial";
	this.agregarUsuario = function (nick, partida) {
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()) {
			partida.fase = new Completado();
		}
	}
	this.iniciarPartida = function (partida) {
		console.log("Faltan jugadores");
	}
	this.abandonarPartida = function (nick, partida) {
		partida.puedeAbandonarPartida(nick);
		//comprobar si no quedan usuarios
	}
	this.atacar = function (nick, partida) {

	}
}

function Completado() {
	this.nombre = "Completado";
	this.agregarUsuario = function (nick, partida) {
		if (partida.comprobarMaximo()) {
			partida.puedeAgregarUsuario(nick);
		}
		else {
			console.log("Lo siento, numero máximo")
		}
	}
	this.iniciarPartida = function (partida) {
		partida.puedeIniciarPartida();
		//asignar engcargos: secuencialmente a todos los usr
		//asignarimpostor dado el array usuario Object.keys

	}
	this.abandonarPartida = function (nick, partida) {
		partida.puedeAbandonarPartida(nick);

	}
	this.atacar = function (nick, partida) {

	}
}
function Jugando() {
	this.nombre = "Jugando";
	this.agregarUsuario = function (nick, partida) {
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida = function (partida) {
	}
	this.abandonarPartida = function (nick, partida) {
		partida.puedeAbandonarPartida(nick);
		//comprobar si termina la partida
	}
	this.atacar = function (nick, partida) {
		partida.puedeAtacar(nick);
	}
}
function Final() {
	this.nombre = "Final";
	this.agregarUsuario = function (nick, partida) {
		console.log("La partida ya ha terminado");
	}
	this.iniciarPartida = function (partida) {
	}
	this.abandonarPartida = function (nick, partida) {
		partida.puedeAbandonarPartida();
		//esto es absurdo (salvo para javier xd)
		//eliminar el usuario y comprobar si no quedan usuarios
	}
	this.atacar = function (nick, partida) {
	}
}

function Usuario(nick, juego) {
	this.nick = nick;
	this.juego = juego;
	this.partida;
	this.impostor = false;
	this.encargo = "ninguno";
	this.estado;
	this.crearPartida = function (num) {
		return this.juego.crearPartida(num, this);
	}
	this.iniciarPartida = function () {
		this.partida.iniciarPartida();
	}
	this.abandonarPartida = function () {
		this.partida.abandonarPartida(nick);
		if (this.partida.numeroDeJugadores() <= 0) {
			this.juego.eliminarPartida(this.partida.codigo);
		}
	}
	this.atacar = function (nick) {
		this.estado.atacar(nick, this);
	}
	this.esAtacado = function () {
		this.estado.esAtacado(this);
	}
}

function Vivo() {
	this.nombre = "vivo";
	this.atacar = function (nick, atacante) {
		this.partida.atacar(nick, atacante);
	}
	this.esAtacado = function (usuario) {
		usuario.estado = new Muerto();
	}
}

function Muerto() {
	this.nombre = "muerto";
	this.atacar = function () {
	}
	this.esAtacado = function (usuario) {
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

// function inicio() {
// 	juego = new Juego()
// 	var usr = new Usuario("Pepe", juego)
// 	var codigo = usr.crearPartida(4)

// 	juego.unirAPartida(codigo, "luis")
// 	juego.unirAPartida(codigo, "luisa")
// 	juego.unirAPartida(codigo, "luisito")

// 	usr.iniciarPartida();
// }

module.exports.Juego = Juego;
module.exports.Usuario = Usuario;