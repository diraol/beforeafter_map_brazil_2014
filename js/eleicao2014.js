function _generate_map(container, ano, cargo, uf, nurna){
  var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

  var subLayerOptions = {
        sql: _monta_query(ano, cargo, uf, nurna),
        cartocss: _monta_cartocss(ano,nurna),
        interactivity: ['cartodb_id','estado'] //TODO: Litar todas as variáveis necessárias, e será preciso de uma função para verificar quais são estas variáveis.
      }

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
        cartodb_logo: false
  }

  // initiate leaflet map
  var mapa = L.map(container, {
        center: estados[uf]['center'],
        zoom: estados[uf]['zoom'],
        scrollWheelZoom: false,
        attributionControl: false
  });

  cartodb.createLayer(mapa, layerUrl, options)
    .addTo(mapa)
    .on('done', function(layer) {
        layer.getSubLayer(0).set(subLayerOptions);
        layer.getSubLayer(0).infowindow.set('template', $(_monta_infowindow(cargo,uf,nurna)).html());
        cartodb.vis.Vis.addInfowindow(mapa, layer.getSubLayer(0), _template_variables(cargo,uf), {
            triggerEvent: 'featureOver'
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

    var before = _generate_map("before", "2010", cargo, uf, nurna),
        after = _generate_map("after", "2014", cargo, uf, nurna);

    $('#map-container').beforeAfter(before, after);

}
