function _generate_map(container, ano, cargo, uf, nurna){
  var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

  var subLayerOptions = {
          sql: _monta_query(ano, cargo, uf, nurna),
          cartocss: _monta_cartocss(nurna),
      }

  var options = {
      'title': "Eleições 2014 - Apuração",
      'shareable': false,
      'searchControl': true,
      'layer_selector': false,
      'legends': true,
  }

  // initiate leaflet map
  var mapa = new L.Map(container, {
    center: estados[uf]['center'],
    zoom: estados[uf]['zoom'],
    scrollWheelZoom: false
  });

  cartodb.createLayer(mapa, layerUrl, options)
    .addTo(mapa)
    .on('done', function(layer) {
      layer.getSubLayer(0).set(subLayerOptions);
      layer.getSubLayer(0).infowindow.set('template', $(_monta_infowindow(cargo,uf,nurna)).html());
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

    var mapa = _generate_map("mapa", "2014", cargo, uf, nurna);

}
