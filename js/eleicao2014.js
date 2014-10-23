var current_hover = {
        place: "",
        year: ""
    };

var sublayers = [];

function _generate_map(container, year, round, cargo, uf, nurna){
    var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

    var subLayerOptions = _build_subLayerOptions(year, round, cargo, uf, nurna);

    var _offset = $('body').offset();

    var options = {
            title: "Eleições 2014 - Apuração",
            shareable: false,
            searchControl: true,
            layer_selector: false,
            legends: true,
            center_lat: estados[uf]['center'][0],
            center_lon: estados[uf]['center'][1],
            zoom: estados[uf]['zoom'],
            scrollwheel: false,
            cartodb_logo: false,
            //refreshTime: 30000,
            infowindow: false,
            tooltip: true
    };

    // initiate leaflet map
    var mapa = L.map(container, {
            center: estados[uf]['center'],
            zoom: estados[uf]['zoom'],
            scrollWheelZoom: false,
            attributionControl: false
    });

    cartodb.config.set({
        cartodb_attributions: "",
        cartodb_logo_link: ""
    });

    var _current_highlighted;

    function _showFeature(year, sql_query, cartocss, cod_tse) {
        if (_current_highlighted != cod_tse){
            if (subLayers.length > 2) {
                var remove_layer = subLayers[2];
                subLayers.pop();
                cartodb.createLayer(mapa, layerUrl, options).addTo(mapa).on('done', function(layer){
                    layer.getSubLayer(0).set({'sql': sql_query, 'cartocss': '#r{polygon-opacity: 0; line-color: #000; line-width: 2; line-opacity: 1;}'});
                    subLayers.push(layer);
                    remove_layer.remove();
                });
            } else {
                cartodb.createLayer(mapa, layerUrl, options).addTo(mapa).on('done', function(layer){
                    layer.getSubLayer(0).set({'sql': sql_query, 'cartocss': '#r{polygon-opacity: 0; line-color: #000; line-width: 2; line-opacity: 1;}'});
                    subLayers.push(layer);
                });
            }
            _current_highlighted = cod_tse;
        } else {
           subLayers[2].remove();
        }
    }

    function _highlight_css(baseSelector, cod_tse) {
        var cartocss = _build_cartocss(baseSelector);
        cartocss += "#r[cod_tse="+cod_tse+"]{line-color: #000; line-width: 2; line-opacity: 1;}";
        //console.log(cartocss);
        return cartocss;
    }

    function _highlight_query(cod_tse) {
        var sql = "SELECT the_geom, the_geom_webmercator, cod_tse, cartodb_id FROM bases.municipios WHERE cod_tse = " + cod_tse;
        return sql;
    }

    var camada = cartodb.createLayer(mapa, layerUrl, options)
        .addTo(mapa)
        .on('done', function(layer) {
            layer.getSubLayer(0).set(subLayerOptions);
            layer.getSubLayer(0).setInteraction(true);
            layer.on('featureOver', function(e, latlng, pos, data) {
                document.body.style.cursor = "pointer";
                var content = "";
                if (uf == "BR") {
                    content = data.uf;
                    //content += "<br/>";
                    //content += data.nurna + " (" + data.partido + ") - " + data.valor_perc + "%";
                    //if (round == 2 && nurna == "") {
                    //    content += " <br/>";
                    //    content += data.nurna2 + " (" + data.partido2 + ") - " + data.valor_perc2 + "%";
                    //}
                } else {
                    content = data.nom_mun;
                }
                $("#tooltip").html(content);
                if (!_offset) _offset = $("body").offset();
                var calc = e.pageX;
                var getWidth = $("body").width() - $("#tooltip").width();
                $("#tooltip").show();
                if (calc > getWidth) {
                    $("#tooltip").css({
                        right: (e.pageX - _offset.right + getWidth) + "px",
                        top: (e.pageY - _offset.top + 25) + "px"
                    });
                } else {
                    $("#tooltip").css({
                        left: (e.pageX - _offset.left) + "px",
                        top: (e.pageY - _offset.top + 25) + "px",
                        right: "auto"
                    });
                }
            });
            layer.on('featureOut', function(){
                $("#tooltip").hide();
                document.body.style.cursor = "default";
            });
            layer.on('featureClick', function(e, latlng, pos, data){
                if (uf != "BR") {
                    _showFeature(year, _highlight_query(data.cod_tse), {'nurna': nurna, 'year': year, 'uf': uf}, data.cod_tse);
                }
                if (top.location.hostname == "estadao.com") {
                    if (uf != "BR") {
                        top.cityCompare(data.cod_tse, year);
                    } else {
                        var re = '/br/g';
                        var current_location = top.location.href;
                        if (current_location.indexOf('/br') == -1) {
                            top.location.href = current_location + data['uf'].toLowerCase();
                        } else {
                            top.location.href = current_location.replace('/br','/' + data['uf'].toLowerCase(), 'gi');
                        }
                    }
                }
            });

            subLayers.push(layer.getSubLayer(0));

        }).on('error', function(err) {
            //log the error
            console.log(err);
        });

    //var legend = L.control({position: 'bottomleft'});

    //legend.onAdd = function(mapa) {

    //    var div = L.DomUtil.create('div', 'info legend'),
    //        //if (round == 2) {
    //        //    if (nurna == "") {
    //        //        grades = []
    //        //        labels = []
    //        //    }
    //        //}
    //        grades = [10, 20, 30, 40, 50],
    //        labels = ['a'],
    //        from, to;

    //    for (var i = 0; i < grades.length; i++) {
    //        from = grades[i];
    //        to = grades[i + 1];

    //        labels.push(
    //                '<i style="background:' + partie_color(from + 1) + '"></i> ' +
    //                from + (to ? '&ndash;' + to : '+')
    //        );
    //    }
    //    labels.push("<i></i>");
    //    labels.push("<i></i>");
    //    labels.push("<i></i>");

    //    div.innerHTML = labels.join('<br>');
    //    return div;

    //};
    //legend.addTo(mapa);

    return mapa;
}

function main(){

    var cargo = _getParameterByName("cargo") == "" ? "presidente" : _getParameterByName("cargo"),
        uf = _getParameterByName("uf") == "" ? "BR" : _getParameterByName("uf").toUpperCase(),
        nurna = _getParameterByName("nurna"),
        turno = _getParameterByName("turno") == "" ? 1 : _getParameterByName("turno");

    if (cargo == "governador" && (uf=="BR" || uf=="")) uf="SP";

    var before = _generate_map("before", "2010", turno, cargo, uf, nurna),
        after = _generate_map("after", "2014", turno, cargo, uf, nurna);

    $('#map-container').beforeAfter(before, after,{
        arrowTop: 0.95,
        animateIntro: true,
        introDelay: 1500,
        introDuration: 2000,
        introPosition: .27,
        imagePath: './imgs/',
        showFullLinks: false,
        permArrows: true,
        arrowLeftOffset: -39,
        arrowRightOffset: -10
    });

    // Ajustando a altura do "pegador"
    $('[id^="handle"]').css({ top: function(){
        return $('[id^="map-container"]').height() * 0.90 + 'px'}, width: '20px', left: '-9px'});

    if (nurna == "") {
        $("#legenda2").show();
        $("#legenda3").hide();
    } else {
        $("#legenda2").hide();
        $("#legenda3").show();
    }

    $('.button').click(function() {
      $('.button').removeClass('selected');
      $(this).addClass('selected');
      LayerActions[$(this).attr('id')]();
    });

    var LayerActions = {
      all: function(){
        subLayers[0].setSQL(_map_query('2014', '1', 'presidente','BR','45'));
        subLayers[0].setCartoCSS(_build_cartocss({'nurna': '45','year':'2014','uf':'BR'}));
        return true;
      },
      capitais: function(){
        subLayers[0].setSQL("SELECT * FROM  WHERE ");
        return true;
      },
      megacities: function(){
        subLayers[0].setSQL("SELECT * FROM  WHERE ");
        return true;
      }
    };

}
