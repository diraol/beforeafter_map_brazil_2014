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
                    polygon-opacity: 0.5;\
                    line-color: #444;\
                    line-width: 0.1;\
                    line-opacity: 0.3; }\
                #resultado_2014[partido='PBAN'] { polygon-fill: #A6CEE3; }\
                #resultado_2014[partido='PBAR'] { polygon-fill: #1F78B4; }\
                #resultado_2014[partido='PLAN'] { polygon-fill: #B2DF8A; }\
                #resultado_2014[partido='PGAL'] { polygon-fill: #33A02C; }\
                #resultado_2014[partido='PJAG'] { polygon-fill: #FB9A99; }\
                #resultado_2014[partido='PARA'] { polygon-fill: #E31A1C; }\
                #resultado_2014[partido='PKUW'] { polygon-fill: #FDBF6F; }\
                #resultado_2014[partido='PT'] { polygon-fill: " + cores_partidos['PT']  + "; }\
                #resultado_2014[partido='PSTU'] { polygon-fill: " + cores_partidos['PSTU']  + "; }\
                #resultado_2014[partido='PCDOB'] { polygon-fill: " + cores_partidos['PCDOB']  + "; }\
                #resultado_2014[partido='PCB'] { polygon-fill: " + cores_partidos['PCB']  + "; }\
                #resultado_2014[partido='PSL'] { polygon-fill: " + cores_partidos['PSL']  + "; }\
                #resultado_2014[partido='PCO'] { polygon-fill: " + cores_partidos['PCO']  + "; }\
                #resultado_2014[partido='PSOL'] { polygon-fill: " + cores_partidos['PSOL']  + "; }\
                #resultado_2014[partido='PMDB'] { polygon-fill: " + cores_partidos['PMDB']  + "; }\
                #resultado_2014[partido='PROS'] { polygon-fill: " + cores_partidos['PROS']  + "; }\
                #resultado_2014[partido='PPL'] { polygon-fill: " + cores_partidos['PPL']  + "; }\
                #resultado_2014[partido='PSB'] { polygon-fill: " + cores_partidos['PSB']  + "; }\
                #resultado_2014[partido='PTB'] { polygon-fill: " + cores_partidos['PTB']  + "; }\
                #resultado_2014[partido='PDT'] { polygon-fill: " + cores_partidos['PDT']  + "; }\
                #resultado_2014[partido='PPS'] { polygon-fill: " + cores_partidos['PPS']  + "; }\
                #resultado_2014[partido='SD'] { polygon-fill: " + cores_partidos['SD']  + "; }\
                #resultado_2014[partido='PSC'] { polygon-fill: " + cores_partidos['PSC']  + "; }\
                #resultado_2014[partido='PTDOB'] { polygon-fill: " + cores_partidos['PTDOB']  + "; }\
                #resultado_2014[partido='PMN'] { polygon-fill: " + cores_partidos['PMN']  + "; }\
                #resultado_2014[partido='PSD'] { polygon-fill: " + cores_partidos['PSD']  + "; }\
                #resultado_2014[partido='PEN'] { polygon-fill: " + cores_partidos['PEN']  + "; }\
                #resultado_2014[partido='PR'] { polygon-fill: " + cores_partidos['PR']  + "; }\
                #resultado_2014[partido='PV'] { polygon-fill: " + cores_partidos['PV']  + "; }\
                #resultado_2014[partido='PP'] { polygon-fill: " + cores_partidos['PP']  + "; }\
                #resultado_2014[partido='PTC'] { polygon-fill: " + cores_partidos['PTC']  + "; }\
                #resultado_2014[partido='PTN'] { polygon-fill: " + cores_partidos['PTN']  + "; }\
                #resultado_2014[partido='PRB'] { polygon-fill: " + cores_partidos['PRB']  + "; }\
                #resultado_2014[partido='PSDC'] { polygon-fill: " + cores_partidos['PSDC']  + "; }\
                #resultado_2014[partido='PRTB'] { polygon-fill: " + cores_partidos['PRTB']  + "; }\
                #resultado_2014[partido='PHS'] { polygon-fill: " + cores_partidos['PHS']  + "; }\
                #resultado_2014[partido='PRP'] { polygon-fill: " + cores_partidos['PRP']  + "; }\
                #resultado_2014[partido='DEM'] { polygon-fill: " + cores_partidos['DEM']  + "; }\
                #resultado_2014[partido='PSDB'] { polygon-fill: " + cores_partidos['PSDB']  + "; }",
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
        refreshTime: 30000,
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
