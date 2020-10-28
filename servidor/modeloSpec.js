var modelo = require("./modelo.js");

describe("El juego del impostor", function () {
    var juego;
    var usuario;

    beforeEach(function () {
        juego = new modelo.Juego();
        usuario = new modelo.Usuario("Pepe", juego);
    });

    it("inicialmente......", function () {
        expect(Object.keys(juego.partidas).length).toEqual(0);
        expect(usuario.nick).toEqual("Pepe");
        expect(usuario.juego).not.toBe(undefined);
    });

    describe("Pepe crea una partida de 4 jugadores", function () {
        var codigo;

        beforeEach(function () {
            codigo = usuario.crearPartida(4);
        });

        it("el usr Pepe crea una partida de 4 jugadores", function () {
            expect(codigo).not.toBe(undefined);
            expect(juego.partidas[codigo].nickOwner).toEqual(usuario.nick);
            expect(juego.partidas[codigo].maximo).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("Inicial");
            expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(1);
        });

        it("se une un jugador a la partida", function () {
            juego.unirAPartida(codigo, "María");
            expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(2);
            juego.unirAPartida(codigo, "José Carlos");
            expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(3);
            juego.unirAPartida(codigo, "Mario");
            expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
            expect(juego.partidas[codigo].fase.nombre).toEqual("Completado");
        });

        it("No se ha asignado ningún impostor",function(){
            var partida = juego.partidas[codigo];
            var nimpostores = 0;
            var keys = Object.keys(juego.partidas[codigo].usuarios);
            for(i=0;i<keys.length;i++){
                if(partida.usuarios[keys[i]].impostor) nimpostores++;
            }
            expect(nimpostores).toEqual(0);
        })

        it("pepe inicia la partida", function () {
            juego.unirAPartida(codigo, "María");
            juego.unirAPartida(codigo, "José Carlos");
            juego.unirAPartida(codigo, "Mario");
            juego.unirAPartida(codigo, "Ana");
            expect(juego.partidas[codigo].fase.nombre).toEqual("Completado");
            usuario.iniciarPartida();
            expect(juego.partidas[codigo].fase.nombre).toEqual("Jugando");
        });


        describe("La partida ya esta iniciada", function () {
            var partida;

            beforeEach(function () {
                juego.unirAPartida(codigo, "María");
                juego.unirAPartida(codigo, "José Carlos");
                juego.unirAPartida(codigo, "Mario");
                usuario.iniciarPartida();
                partida = juego.partidas[codigo];
            });

            it("Se ha asignado un impostor",function(){
                var nimpostores = 0;
                var keys = Object.keys(juego.partidas[codigo].usuarios);
                for(i=0;i<keys.length;i++){
                    if(partida.usuarios[keys[i]].impostor) nimpostores++;
                }
                expect(nimpostores).toEqual(1);
            })
            it("Se han asignado las tareas",function(){
                var keys = Object.keys(juego.partidas[codigo].usuarios);
                for(i=0;i<keys.length;i++){
                    expect(partida.usuarios[keys[i]].encargo).not.toEqual("ninguno");
                }
            })
            it("Mario sale de la partida", function () {
                expect(Object.keys(partida.usuarios).length).toEqual(4);
                var mario = partida.usuarios['Mario'];
                mario.abandonarPartida();
                expect(Object.keys(partida.usuarios).length).toEqual(3);
                expect(partida.usuarios['Mario']).toBe(undefined);
            });
        });

    });
});