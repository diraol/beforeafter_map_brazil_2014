var current_hover = {
        place: "",
        year: ""
    };

function _generate_map(container, ano, cargo, uf, nurna){
    var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

    var subLayerOptions = _monta_subLayerOptions(ano,cargo,uf,nurna);

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
            refreshTime: 30000,
            infowindow: false,
            tooltip: true
    }

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

    cartodb.createLayer(mapa, layerUrl, options)
        .addTo(mapa)
        .on('done', function(layer) {
            layer.getSubLayer(0).set(subLayerOptions);
            layer.getSubLayer(0).setInteraction(true);
        layer.on('featureOver', function(e, latlng, pos, data){
            //$("#tooltip").show(250);
            //$("#tooltip").css({"top": pos.y - 10, "left": pos.x + 40});
            if (uf == "" || uf == "BR") {
                if (current_hover['place'] != data.uf || current_hover['year'] != ano) {
                    current_hover['place'] = data.uf;
                    current_hover['year'] = ano;
                    var query = _monta_tooltip_query(ano, cargo, uf, data.uf, null);
                    $.get(query, function(data2) {
                        $("#tooltip").html(_monta_tooltip(data.estado, cargo, data2.rows, ano));
                    });
                }
            } else {
                if (current_hover['place'] != data.cod_tse_municipio || current_hover['year'] != ano) {
                    current_hover['place'] = data.cod_tse_municipio;
                    current_hover['year'] = ano;
                    var query = _monta_tooltip_query(ano, cargo, uf, data.uf, data.cod_tse_municipio);
                    $.get(query, function(data2) {
                        var local = data.nome_ibge_com_acento + "("+ data.uf +")";
                        $("#tooltip").html(_monta_tooltip(local, cargo, data2.rows, ano));
                    });
                }
            }
        });
        layer.on('featureOut', function(){
            //$("#tooltip").hide(250);
        });

        layer.on('featureClick', function(e, latlgn, pos, data){
            if (uf == "" || uf == "BR") {
                location.search = "?uf=" + data['uf'].toLowerCase() + "&nurna=" + nurna + "&cargo=" + cargo;
            } else {
                location.search = "?uf=BR&nurna=" + nurna + "&cargo=" + cargo;
            }
        });
    }).on('error', function(err) {
      //log the error
      console.log(err);
    });
  return mapa;
}

function main(){

    var cargo = _getParameterByName("cargo") == "" ? "presidente" : _getParameterByName("cargo"),
        uf = _getParameterByName("uf") == "" ? "BR" : _getParameterByName("uf").toUpperCase(),
        nurna = _getParameterByName("nurna");

    if (cargo == "governador" && (uf=="BR" || uf=="")) uf="SP";

    var before = _generate_map("before", "2010", cargo, uf, nurna),
        after = _generate_map("after", "2014", cargo, uf, nurna);

    $('#map-container').beforeAfter(before, after,{
        arrowTop: 0.95,
        animateIntro: true,
        introDelay: 1500,
        introDuration: 2000,
        introPosition: .75,
        imagePath: './imgs/',
        showFullLinks: false,
        permArrows: true,
        arrowLeftOffset: -33,
        arrowRightOffset: -16
    });

    // Ajustando a altura da "barra verde"
    $('[id^="handle"]').css({ top: function(){
        return $('[id^="map-container"]').height() * 0.90 + 'px'}});

}
