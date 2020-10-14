describe("El juego del impostor", function () {
    var juego;
    var usuario;

    beforeEach(function () {
        juego = new Juego();
        usuario = new Usuario("Pepe", juego);
    });

    it("inicialmente......", function () {
        expect(Object.keys(juego.partidas).length).toEqual(0);
        expect(usuario.nick).toEqual("Pepe");
        expect(usuario.juego).not.toBe(undefined);
    });

    it("el usr Pepe crea una partida de 4 jugadores", function () {
        var codigo = usuario.crearPartida(4);
        expect(codigo).not.toBe(undefined);
        expect(juego.partidas[codigo].nickOwner).toEqual(usuario.nick);
        expect(juego.partidas[codigo].fase.nombre).toEqual("Inicial");
        expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(1);
    });

    it("se une un jugador a la partida", function () {
        var codigo = usuario.crearPartida(4);
        juego.unirAPartida(codigo,"María");
        expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(2);
        juego.unirAPartida(codigo,"José Carlos");
        expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(3);
        juego.unirAPartida(codigo,"Mario");
        expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
        expect(juego.partidas[codigo].fase.nombre).toEqual("Completado");
        juego.unirAPartida(codigo,"Bienvenido");
        expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
    });

    it("la partida da comienzo al unirse el numero de jugadores", function () {
        var codigo = usuario.crearPartida(3);
        juego.unirAPartida(codigo,"María");
        juego.unirAPartida(codigo,"José Carlos");
        expect(juego.partidas[codigo].fase.nombre).toEqual("Completado");
        usuario.iniciarPartida();
        expect(juego.partidas[codigo].fase.nombre).toEqual("Jugando");
    });
});