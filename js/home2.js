var partie_color = {"PT": "#b70000", "PSTU":"#ce2200", "PCDOB":"#e5361f", "PCB":"#dd511f", "PSL":"#e26033", "PCO":"#e27037", "PSOL":"#e88900", "PMDB":"#f49600", "PROS":"#f2ad00", "PPL":"#efb600", "PSB":"#f4ba00", "PTB":"#f7c800", "PDT":"#ffcf06", "PPS":"#ffdb43", "SD":"#ffde55", "PSC":"#ffe966", "PTDOB":"#eded54", "PMN":"#d0e224", "PSD":"#bcd64d", "PEN":"#abc966", "PR":"#9ec666", "PV":"#97c281", "PP":"#8cbe8e", "PTC":"#71bca7", "PTN":"#4eb3c4", "PRB":"#4eaac6", "PSDC":"#5c9dc4", "PRTB":"#6195bc", "PHS":"#5e85b5", "PRP":"#5d7aba", "DEM":"#4966b7", "PSDB":"#4861bc"};

function _generate_map(container){
  var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

  var subLayerOptions = {

    sql: "SELECT S.the_geom_webmercator, S.uf, max(R.valor_perc) as valor_perc, (array_agg(R.nurna ORDER BY valor_perc DESC, partido ASC))[1] as nurna, (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido, max(R.cartodb_id) as cartodb_id FROM bases.ufs as S, urna2014.resultado_2014_2 as R WHERE R.cargo = 1 AND R.uf = S.UF AND R.cod_tse is null GROUP BY S.the_geom_webmercator, S.uf",
    cartocss: "#r{\
polygon-opacity: 1;\
line-color: #444;\
line-width: 0.1;\
line-opacity: 0.3; }\
#r[partido='PT'] { polygon-fill: " + partie_color['PT']  + "; }\
#r[partido='PSTU'] { polygon-fill: " + partie_color['PSTU']  + "; }\
#r[partido='PCDOB'] { polygon-fill: " + partie_color['PCDOB']  + "; }\
#r[partido='PCB'] { polygon-fill: " + partie_color['PCB']  + "; }\
#r[partido='PSL'] { polygon-fill: " + partie_color['PSL']  + "; }\
#r[partido='PCO'] { polygon-fill: " + partie_color['PCO']  + "; }\
#r[partido='PSOL'] { polygon-fill: " + partie_color['PSOL']  + "; }\
#r[partido='PMDB'] { polygon-fill: " + partie_color['PMDB']  + "; }\
#r[partido='PROS'] { polygon-fill: " + partie_color['PROS']  + "; }\
#r[partido='PPL'] { polygon-fill: " + partie_color['PPL']  + "; }\
#r[partido='PSB'] { polygon-fill: " + partie_color['PSB']  + "; }\
#r[partido='PTB'] { polygon-fill: " + partie_color['PTB']  + "; }\
#r[partido='PDT'] { polygon-fill: " + partie_color['PDT']  + "; }\
#r[partido='PPS'] { polygon-fill: " + partie_color['PPS']  + "; }\
#r[partido='SD'] { polygon-fill: " + partie_color['SD']  + "; }\
#r[partido='PSC'] { polygon-fill: " + partie_color['PSC']  + "; }\
#r[partido='PTDOB'] { polygon-fill: " + partie_color['PTDOB']  + "; }\
#r[partido='PMN'] { polygon-fill: " + partie_color['PMN']  + "; }\
#r[partido='PSD'] { polygon-fill: " + partie_color['PSD']  + "; }\
#r[partido='PEN'] { polygon-fill: " + partie_color['PEN']  + "; }\
#r[partido='PR'] { polygon-fill: " + partie_color['PR']  + "; }\
#r[partido='PV'] { polygon-fill: " + partie_color['PV']  + "; }\
#r[partido='PP'] { polygon-fill: " + partie_color['PP']  + "; }\
#r[partido='PTC'] { polygon-fill: " + partie_color['PTC']  + "; }\
#r[partido='PTN'] { polygon-fill: " + partie_color['PTN']  + "; }\
#r[partido='PRB'] { polygon-fill: " + partie_color['PRB']  + "; }\
#r[partido='PSDC'] { polygon-fill: " + partie_color['PSDC']  + "; }\
#r[partido='PRTB'] { polygon-fill: " + partie_color['PRTB']  + "; }\
#r[partido='PHS'] { polygon-fill: " + partie_color['PHS']  + "; }\
#r[partido='PRP'] { polygon-fill: " + partie_color['PRP']  + "; }\
#r[partido='DEM'] { polygon-fill: " + partie_color['DEM']  + "; }\
#r[partido='PSDB'] { polygon-fill: " + partie_color['PSDB']  + "; }",
};

  var options = {
        title: "Eleições 2014 - Apuração",
        shareable: false,
        searchControl: false,
        layer_selector: false,
        legends: false,
        center_lat: "-15.587239525774244",
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
        center: [-15.587239525774244,-55.51463843650],
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
    var mapa = _generate_map("mapa");
}
