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
                #resultado_2010[partido='PT'] { polygon-fill: #A00200; }\
                #resultado_2010[partido='PSOL'] { polygon-fill: #B02B01; }\
                #resultado_2010[partido='PCDOB'] { polygon-fill: #B53901; }\
                #resultado_2010[partido='PPS'] { polygon-fill: #BA4601; }\
                #resultado_2010[partido='SDD'] { polygon-fill: #BF5301; }\
                #resultado_2010[partido='PSB'] { polygon-fill: #CF7D03; }\
                #resultado_2010[partido='PMDB'] { polygon-fill: #D48B03; }\
                #resultado_2010[partido='PROS'] { polygon-fill: #D99803; }\
                #resultado_2010[partido='PRTB'] { polygon-fill: #DEA604; }\
                #resultado_2010[partido='PTB'] { polygon-fill: #E4B304; }\
                #resultado_2010[partido='PMN'] { polygon-fill: #E9C104; }\
                #resultado_2010[partido='PDT'] { polygon-fill: #EECE04; }\
                #resultado_2010[partido='PTDOB'] { polygon-fill: #F3DC05; }\
                #resultado_2010[partido='PR'] { polygon-fill: #F4E509; }\
                #resultado_2010[partido='PSL'] { polygon-fill: #EAE116; }\
                #resultado_2010[partido='PHS'] { polygon-fill: #D5D931; }\
                #resultado_2010[partido='PRP'] { polygon-fill: #CAD63E; }\
                #resultado_2010[partido='PSD'] { polygon-fill: #B6CE58; }\
                #resultado_2010[partido='PEN'] { polygon-fill: #ABC966; }\
                #resultado_2010[partido='PSC'] { polygon-fill: #ABC966; }\
                #resultado_2010[partido='PV'] { polygon-fill: #97C281; }\
                #resultado_2010[partido='PP'] { polygon-fill: #8CBE8E; }\
                #resultado_2010[partido='PTC'] { polygon-fill: #82BA9B; }\
                #resultado_2010[partido='DEM'] { polygon-fill: #6DB3B6; }\
                #resultado_2010[partido='PRB'] { polygon-fill: #6297B9; }\
                #resultado_2010[partido='PSDB'] { polygon-fill: #5D83BB; }",
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
