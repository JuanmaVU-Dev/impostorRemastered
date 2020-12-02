function ControlWeb() {
    this.mostrarCrearPartida = function () {
        var cadena =      '<div id="mostrarCP">'
        cadena = cadena + '<h3>Crear partida</h3>';
        cadena = cadena +   '<form class="form-inline">';
        cadena = cadena +       '<div class="input-group">';
        cadena = cadena +           '<span for="usr" class="input-group-addon">Nick</span>';
        cadena = cadena +           '<input type="txt" class="form-control" id="nick" placeholder="Nombre en el juego">';
        cadena = cadena +       '</div>';
        cadena = cadena +       '<div class="input-group">';
        cadena = cadena +           '<span for="num" class="input-group-addon">Número</span>';
        cadena = cadena +           '<input type="number" class="form-control" id="num" min="4" max="10" value=4>';
        cadena = cadena +       '</div>';
        cadena = cadena +   '</form>';
        cadena = cadena +   '<form action="/action_page.php">';
        cadena = cadena +       '<div class="form-group">';
        cadena = cadena +           '<br><button type="button" id="btnCrear" class="btn btn-primary">Crear partida</button>';
        cadena = cadena +       '</div>';
        cadena = cadena +   '</form>';
        cadena = cadena + '</div>';
        $('#crearPartida').append(cadena);
        $('#btnCrear').on('click', function () {
            var nick = $('#nick').val();
            var num = $('#num').val();
            if(nick && num>=4){
                $('#mostrarCP').remove();
                ws.crearPartida(nick, num);
            }
            //mostrar esperarando rival
            //controlar la entrada
        });
    }
    this.mostrarEsperandoRival = function () {
        this.limpiar();
        var cadena = '<div id="mER">';
        cadena = cadena + '<img src="cliente/img/loading.gif" class="img-rounded" alt="loading image">';
        if(ws.owner){
            cadena = cadena + '<button type="button" id="btnIniciar" class="btn btn-primary">Iniciar partida</button>';
        }
        cadena = cadena + '</div>';
        $('#esperando').append(cadena);
        $('#btnIniciar').on('click', function () {
            ws.iniciarPartida();
        });
    }

    this.mostrarUnirAPartida = function (lista) {
        $('#mUAP').remove();
        var cadena = '<div id = "mUAP">';
        cadena = cadena + '<h3>Lista de partidas</h3>';
        cadena = cadena + '<div  class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            var maximo=lista[i].maximo;
	        var numJugadores=maximo-lista[i].huecos;
            cadena = cadena + '<a href="#" value=' + lista[i].codigo + ' class="list-group-item">';
            cadena = cadena + 'Código: ' + lista[i].codigo + '<span class="badge">' + numJugadores +'/' + maximo + '</span>';
            cadena = cadena + '</a>';
        }
        cadena = cadena + '</div>';
        cadena = cadena + '<button type="button" id="btnUnir" class="btn btn-primary">Unir a partida</button>';
        cadena = cadena + '</div>';
        $('#unirAPartida').append(cadena);
        StoreValue = [];
        $(".list-group a").click(function () {
            StoreValue = [];
            StoreValue.push($(this).attr("value"));
        });

        $('#btnUnir').on('click', function () {
            var nick = $('#nick').val();
            if (nick != "" && StoreValue[0]) {
                var codigo = StoreValue[0];
                $('#mostrarCP').remove();
                $('#mUAP').remove();
                ws.unirAPartida(codigo, nick);
            }
        });
    }

    this.mostrarListaJugadores = function (lista) {
        $('#mostrarListaEsperando').remove();
        var cadena = '<div id="mostrarListaEsperando"><h3>Lista Jugadores</h3>';
        cadena = cadena + '<ul class="list-group">';
        for (var i = 0; i < lista.length; i++) {
            cadena = cadena + '<li class="list-group-item">' + lista[i] + '</li>';
        }
        cadena = cadena + '</ul></div>';
        $('#listaEsperando').append(cadena);
    }

    this.limpiar = function () {
        $('#mUAP').remove();
        $('#mCP').remove();
        $('#mostrarListaPartidas').remove();
        $('#mER').remove();
        $('#mostrarListaEsperando').remove();
    }
}