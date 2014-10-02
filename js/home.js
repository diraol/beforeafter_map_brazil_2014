var cores_partidos = {"PT": "#b70000", "PSTU":"#ce2200", "PCDOB":"#e5361f", "PCB":"#dd511f", "PSL":"#e26033", "PCO":"#e27037", "PSOL":"#e88900", "PMDB":"#f49600", "PROS":"#f2ad00", "PPL":"#efb600", "PSB":"#f4ba00", "PTB":"#f7c800", "PDT":"#ffcf06", "PPS":"#ffdb43", "SD":"#ffde55", "PSC":"#ffe966", "PTDOB":"#eded54", "PMN":"#d0e224", "PSD":"#bcd64d", "PEN":"#abc966", "PR":"#9ec666", "PV":"#97c281", "PP":"#8cbe8e", "PTC":"#71bca7", "PTN":"#4eb3c4", "PRB":"#4eaac6", "PSDC":"#5c9dc4", "PRTB":"#6195bc", "PHS":"#5e85b5", "PRP":"#5d7aba", "DEM":"#4966b7", "PSDB":"#4861bc"};

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
    cartocss: "#resultado_2015 {\
                    polygon-opacity: 0.5;\
                    line-color: #444;\
                    line-width: 0.1;\
                    line-opacity: 0.3; }\
                #resultado_2015[partido='PBAN'] { polygon-fill: #A6CEE3; }\
                #resultado_2015[partido='PBAR'] { polygon-fill: #1F78B4; }\
                #resultado_2015[partido='PLAN'] { polygon-fill: #B2DF8A; }\
                #resultado_2015[partido='PGAL'] { polygon-fill: #33A02C; }\
                #resultado_2015[partido='PJAG'] { polygon-fill: #FB9A99; }\
                #resultado_2015[partido='PARA'] { polygon-fill: #E31A1C; }\
                #resultado_2015[partido='PKUW'] { polygon-fill: #FDBF6F; }\
                #resultado_2015[partido='PT'] { polygon-fill: " + cores_partidos['PT']  + "; }\
                #resultado_2015[partido='PSTU'] { polygon-fill: " + cores_partidos['PSTU']  + "; }\
                #resultado_2015[partido='PCDOB'] { polygon-fill: " + cores_partidos['PCDOB']  + "; }\
                #resultado_2015[partido='PCB'] { polygon-fill: " + cores_partidos['PCB']  + "; }\
                #resultado_2015[partido='PSL'] { polygon-fill: " + cores_partidos['PSL']  + "; }\
                #resultado_2015[partido='PCO'] { polygon-fill: " + cores_partidos['PCO']  + "; }\
                #resultado_2015[partido='PSOL'] { polygon-fill: " + cores_partidos['PSOL']  + "; }\
                #resultado_2015[partido='PMDB'] { polygon-fill: " + cores_partidos['PMDB']  + "; }\
                #resultado_2015[partido='PROS'] { polygon-fill: " + cores_partidos['PROS']  + "; }\
                #resultado_2015[partido='PPL'] { polygon-fill: " + cores_partidos['PPL']  + "; }\
                #resultado_2015[partido='PSB'] { polygon-fill: " + cores_partidos['PSB']  + "; }\
                #resultado_2015[partido='PTB'] { polygon-fill: " + cores_partidos['PTB']  + "; }\
                #resultado_2015[partido='PDT'] { polygon-fill: " + cores_partidos['PDT']  + "; }\
                #resultado_2015[partido='PPS'] { polygon-fill: " + cores_partidos['PPS']  + "; }\
                #resultado_2015[partido='SD'] { polygon-fill: " + cores_partidos['SD']  + "; }\
                #resultado_2015[partido='PSC'] { polygon-fill: " + cores_partidos['PSC']  + "; }\
                #resultado_2015[partido='PTDOB'] { polygon-fill: " + cores_partidos['PTDOB']  + "; }\
                #resultado_2015[partido='PMN'] { polygon-fill: " + cores_partidos['PMN']  + "; }\
                #resultado_2015[partido='PSD'] { polygon-fill: " + cores_partidos['PSD']  + "; }\
                #resultado_2015[partido='PEN'] { polygon-fill: " + cores_partidos['PEN']  + "; }\
                #resultado_2015[partido='PR'] { polygon-fill: " + cores_partidos['PR']  + "; }\
                #resultado_2015[partido='PV'] { polygon-fill: " + cores_partidos['PV']  + "; }\
                #resultado_2015[partido='PP'] { polygon-fill: " + cores_partidos['PP']  + "; }\
                #resultado_2015[partido='PTC'] { polygon-fill: " + cores_partidos['PTC']  + "; }\
                #resultado_2015[partido='PTN'] { polygon-fill: " + cores_partidos['PTN']  + "; }\
                #resultado_2015[partido='PRB'] { polygon-fill: " + cores_partidos['PRB']  + "; }\
                #resultado_2015[partido='PSDC'] { polygon-fill: " + cores_partidos['PSDC']  + "; }\
                #resultado_2015[partido='PRTB'] { polygon-fill: " + cores_partidos['PRTB']  + "; }\
                #resultado_2015[partido='PHS'] { polygon-fill: " + cores_partidos['PHS']  + "; }\
                #resultado_2015[partido='PRP'] { polygon-fill: " + cores_partidos['PRP']  + "; }\
                #resultado_2015[partido='DEM'] { polygon-fill: " + cores_partidos['DEM']  + "; }\
                #resultado_2015[partido='PSDB'] { polygon-fill: " + cores_partidos['PSDB']  + "; }",
  };

  var options = {
        title: "Eleições 2015 - Apuração",
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
    var mapa = _generate_map("mapa", "2015", "presidente", "br", "");
}
