var partie_color = {"PT": "#b70000", "PSTU":"#ce2200", "PCDOB":"#e5361f", "PCB":"#dd511f", "PSL":"#e26033", "PCO":"#e27037", "PSOL":"#e88900", "PMDB":"#f49600", "PROS":"#f2ad00", "PPL":"#efb600", "PSB":"#f4ba00", "PTB":"#f7c800", "PDT":"#ffcf06", "PPS":"#ffdb43", "SD":"#ffde55", "PSC":"#ffe966", "PTDOB":"#eded54", "PMN":"#d0e224", "PSD":"#bcd64d", "PEN":"#abc966", "PR":"#9ec666", "PV":"#97c281", "PP":"#8cbe8e", "PTC":"#71bca7", "PTN":"#4eb3c4", "PRB":"#4eaac6", "PSDC":"#5c9dc4", "PRTB":"#6195bc", "PHS":"#5e85b5", "PRP":"#5d7aba", "DEM":"#4966b7", "PSDB":"#4861bc"};

function _generate_map(container, ano, cargo, uf, nurna){
  var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

  var subLayerOptions = {
    sql: "SELECT\
            R.cartodb_id,\
            E.the_geom_webmercator,\
            E.estado,\
            E.uf,\
            'Presidente' as cargo,\
            R.num_urna_cand,\
            R.valor_perc,\
            R.partido\
          FROM\
            urna2014.resultado_" + ano + " R,\
            estadao.poligonosestados E\
          WHERE\
            R.estado = E.uf AND\
            R.cod_tse_municipio is null\
          ORDER BY\
            valor_perc,\
            cartodb_id",
    cartocss: "#resultado_2014 {\
                    polygon-opacity: 1;\
                    line-color: #444;\
                    line-width: 0.1;\
                    line-opacity: 0.3; }\
                #resultado_2014[partido='PT'] { polygon-fill: " + partie_color['PT']  + "; }\
                #resultado_2014[partido='PSB'] { polygon-fill: " + partie_color['PSB']  + "; }\
                #resultado_2014[partido='PSDB'] { polygon-fill: " + partie_color['PSDB']  + "; }",
  };

  var options = {
        title: "Eleições 2014 - Apuração",
        shareable: false,
        searchControl: false,
        layer_selector: false,
        legends: false,
        center_lat: "-17.987239525774244",
        center_lon: "-55.51463843650",
        zoom: 4,
        scrollwheel: false,
        cartodb_logo: false,
        //refreshTime: 30000,
        infowindow: false,
        tooltip: false
  }

  // initiate leaflet map
  var mapa = L.map(container, {
        center: [-17.987239525774244,-55.51463843650],
        zoom: 4,
        scrollWheelZoom: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        tap: false,
        trackResize: false,
        keyboard: false,
        zoomControl: false,
        attributionControl: false,
  });

  cartodb.config.set({
    cartodb_attributions: "",
    cartodb_logo_link: ""
  });

  cartodb.createLayer(mapa, layerUrl, options)
    .addTo(mapa)
    .on('done', function(layer) {
        layer.getSubLayer(0).set(subLayerOptions);
        layer.getSubLayer(0).setInteraction(false);
        layer.on('featureOver', function(e, latlng, pos, data){
            e.preventDefault();
        });
        layer.on('featureOut', function(){
            e.preventDefault();
        });

        layer.on('featureClick', function(e, latlgn, pos, data){
            e.preventDefault();
        });
    }).on('error', function(err) {
      //log the error
      console.log(err);
    });
  return mapa;
}

function main(){
    var mapa = _generate_map("mapa", "2014", "presidente", "br", "");
}
