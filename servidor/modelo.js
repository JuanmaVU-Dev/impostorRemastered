function Juego() {
	this.partidas = {};
	this.crearPartida = function (num, owner) {
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
			var partida = this.partida[key];
			huecos = partida.huecos();
			if(huecos>0){
				listaJSON.push({"codigo":key,"huecos":huecos});
			}
		}
		return listaJSON;
	}
}

function Partida(num, owner, codigo) {
	this.maximo = num;
	this.nickOwner = owner;
	this.fase = new Inicial();
	this.codigo = codigo;
	this.usuarios = {};
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
		let i=0;
		for (var key in this.usuarios) {
		    this.usuarios[key].encargo=this.tareas[i];
		    i=(i+1)%(this.tareas.length);
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
		if (!this.comprobarMinimo()) {
			this.fase = new Inicial();
		}
	}
	this.eliminarUsuario = function (nick) {
		delete this.usuarios[nick];
	}
	this.numeroDeJugadores = function () {
		return Object.keys(this.usuarios).length;
	}
	this.atacar = function (nick) {
			this.fase.atacar(nick, this);
	}
	this.puedeAtacar = function (inocente) {
		this.usuarios[inocente].esAtacado();
		this.comprobarFinal();
	}
	this.numeroImpostoresVivos = function () {
		let cont = 0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor && this.usuarios[key].estado.nombre == "vivo") {
				cont++;
			}
		}
		return cont;
	}
	this.numeroCiudadanosVivos = function () { 
		let cont = 0;
		for (var key in this.usuarios) {
			if (!this.usuarios[key].impostor && this.usuarios[key].estado.nombre == "vivo") {
				cont++;
			}
		}
		return cont;
	}
	this.votar = function(sus){
		this.fase.votar(sus, this);
	}
	this.puedeVotar = function(sus){
		this.usuarios[sus].esVotado();
	}
	this.gananImpostores = function () {
		return this.numeroImpostoresVivos() >= this.numeroCiudadanosVivos();
	}
	this.gananCiudadanos = function () {
		return this.numeroImpostoresVivos() == 0;
	}
	this.masVotado=function(){
		let max=1;
		var usr=undefined;
		for (var key in this.usuarios) {
			if (this.usuarios[key].impostor.votos >= max && this.usuarios[key].estado.nombre=="vivo") {
				max = this.usuarios[key].impostor.votos;
				usr = this.usuarios[key];
			}
		}
		return usr;
	}
	this.numeroSkips=function(){
		let nSkips=0;
		for (var key in this.usuarios) {
			if (this.usuarios[key].skip && this.usuarios[key].estado.nombre=="vivo") {
				nSkips++;
			}
		}
		return nSkips;
	}
	this.comprobarVotacion=function(){
		let elegido=this.masVotado();
		if (elegido && elegido.votos>this.numeroSkips()){
			//si es el mas votado, se le mata
			elegido.esAtacado();
		}
	}
	this.masVotado=function(){
		let votado=undefined;
		let max=1;
		for (var key in this.usuarios) {
			if (max<this.usuarios[key].votos){
				max=this.usuarios[key].votos;
				votado=this.usuarios[key];
			}
		}
		return votado;
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartida();
		}
		else if (this.gananCiudadanos()){
			this.finPartida();
		}
	}
	this.finPartida=function(){
		this.fase=new Final();
	}
	this.lanzarVotacion=function(){
		this.fase.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.fase=new Votacion();
	}
	this.huecos = function(){
		return this.maximo-this.numeroDeJugadores();
	}
	this.agregarUsuario(owner);
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
	this.atacar = function (inocente) {
	}
	this.lanzarVotacion = function(){
	}
	this.votar=function(sus, partida){
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
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
	this.atacar = function (inocente) {
	}
	this.lanzarVotacion = function(){
	}
	this.votar=function(sus, partida){
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
	this.atacar = function (inocente, partida) {
		partida.puedeAtacar(inocente);
	}
	this.lanzarVotacion = function(partida){
		partida.puedeLanzarVotacion();
	}
	this.votar=function(sus, partida){
	}
}

function Votacion(){
	this.nombre="Votacion";
	this.agregarUsuario=function(nick,partida){}
	this.iniciarPartida=function(partida){}
	this.abandonarPartida=function(nick,partida){}
	this.atacar=function(inocente){}
	this.lanzarVotacion=function(){}
	this.votar=function(sus, partida){
		partida.puedeVotar(sus);
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
		//partida.puedeAbandonarPartida();
		//esto es absurdo (salvo para javier xd)
		//eliminar el usuario y comprobar si no quedan usuarios
	}
	this.atacar = function (nick, partida) {
	}
	this.lanzarVotacion = function(){
	}
	this.votar=function(sus, partida){
	}
}

function Usuario(nick) {
	this.nick = nick;
	// this.juego = juego;
	this.partida;
	this.impostor = false;
	this.encargo = "ninguno";
	this.votos = 0;
	this.skip = false;
	this.haVotado = false;
	this.estado = new Vivo();
	this.iniciarPartida = function () {
		this.partida.iniciarPartida();
	}
	this.abandonarPartida = function () {
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numeroDeJugadores() <= 0) {
			console.log(this.nick+" era el ultimo jugador de la partida.")
		}
	}
	this.atacar = function (nick) {
		if (this.impostor) this.partida.atacar(nick);
	}
	this.saltar=function(){
		this.skip=true;
	}
	this.lanzarVotacion=function(){
		this.estado.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
	this.esAtacado = function () {
		this.estado.esAtacado(this);
	}
	this.votar=function(sospechoso){
		this.haVotado=true;
		this.partida.votar(sospechoso);
	}
	this.esVotado=function(){
		this.votos++;
	}
}

function Vivo() {
	this.nombre = "vivo";
	this.esAtacado = function (usuario) {
		usuario.estado = new Muerto();
	}
	this.lanzarVotacion = function(){
		usr.puedeLanzarVotacion();
	}
}

function Muerto() {
	this.nombre = "muerto";
	this.esAtacado = function (usuario) {
	}
	this.lanzarVotacion = function(){
	}
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

// function inicio() {
// 	juego = new Juego()
// 	var usr = new Usuario("Pepe")
// 	var codigo = usr.crearPartida(4);

// 	juego.unirAPartida(codigo, "luis");
// 	juego.unirAPartida(codigo, "luisa");
// 	juego.unirAPartida(codigo, "luisito");

// 	usr.iniciarPartida();
// }

module.exports.Juego = Juego;
module.exports.Usuario = Usuario;