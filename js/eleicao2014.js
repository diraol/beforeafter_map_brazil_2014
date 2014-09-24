function _getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Função que monta a query que será efetuada
function _monta_query(ano, cargo, uf, nurna){
  var query = "";

  if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna == "")) {
    // Cargo Presidencial
    // Sem estado definido - mostra mapa nacional com divisões e totalizações estaduais
    // Sem nurna - Vencedor de cada estado
    query = "SELECT\
               R.cartodb_id,\
               E.the_geom_webmercator,\
               E.estado,\
               E.eleitorado_2014 as eleitorado,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.uf AND\
               R.cod_tse_municipio is null\
             ORDER BY\
               valor_perc,\
               cartodb_id";
    console.log("Pres - Sem UF (Geral) - sem Cand");
  } else if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Sem estado definido - mostra mapa nacional com divisões e totalizações estaduais
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada estado
    query = "SELECT\
               R.cartodb_id,\
               E.the_geom_webmercator,\
               E.estado,\
               E.eleitorado_2014 as eleitorado,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.uf AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio is null AND\
               R.num_urna_cand = " + nurna;
    console.log("Pres - Sem UF (Geral) - com Cand");
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna == "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
    console.log("Pres - Com UF (estadual) - Sem Cand");
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
    console.log("Pres - Com UF (estadual) - Com Cand");
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna == "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = 'SP' AND\
               M.estado = 'SP' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
    console.log("Gov - Sem UF (SP) - Sem Cand");
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna != "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = 'SP' AND\
               M.estado = 'SP' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
    console.log("Gov - Sem UF (SP) - Com Cand");
  } else if ((cargo == "governador") && (uf != "") && (nurna == "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
    console.log("Gov - Com UF - Sem Cand");
  } else if ((cargo == "governador") && (uf != "") && (nurna != "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.eleitorado,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
    console.log("Gov - Com UF - Com Cand");
  } else {
    //default query
    query = "SELECT\
               R.cartodb_id,\
               E.the_geom_webmercator,\
               E.estado,\
               E.eleitorado_2014,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_2014 R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.estado AND\
               R.cargo_cand = 1\
             ORDER BY\
               valor_perc,\
               cartodb_id";
    console.log("Pres - Sem UF (Geral) - sem Cand");
  }
    return query;
}

function _monta_cartocss(nurna) {
  //Montagem do CartoCSS
  //  São 2 casos, o primeiro sem candidato definido que vai mostrar os líderes de cada área
  //  e o segundo com candidato definido, que vai mostrar um 'Choropleth' na região
  var cartocss = "";
  if (nurna == "") {
    cartocss = modelo_css['vencedor']

  } else {
    cartocss = modelo_css['desempenho']
  }
  return cartocss;
}

function _monta_infowindow(cargo, uf, nurna) {

  var template = "";

  if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna == "")) {
    template = "infowindow_template_nacional";
  } else if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna != "")) {
    template = "infowindow_template_nacional";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna == "")) {
    template = "infowindow_template_estadual";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna != "")) {
    template = "infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna == "")) {
    template = "infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna != "")) {
    template = "infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf != "") && (nurna == "")) {
    template = "infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf != "") && (nurna != "")) {
    template = "infowindow_template_estadual";
  } else {
    template = "infowindow_template_nacional";
  }

  return template;

}

function init(){

  var cargo = _getParameterByName("cargo") == "" ? "presidente" : _getParameterByName("cargo"),
      uf = _getParameterByName("uf") == "" ? "BR" : _getParameterByName("uf").toUpperCase(),
      nurna = _getParameterByName("nurna");

  var layerUrl = 'http://grupoestado.cartodb.com/api/v2/viz/01de6de0-3f6b-11e4-8bbf-0e10bcd91c2b/viz.json';

  var subLayerOptions = {
          sql: _monta_query("2014", cargo, uf, nurna),
          cartocss: _monta_cartocss(nurna),
      }

  // initiate leaflet map
  var mapa = new L.Map('mapa', {
    center: estados[uf]['center'],
    zoom: estados[uf]['zoom'],
    scrollWheelZoom: false
  });
  //map.on('click', function(e) { console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng) })

  cartodb.createLayer(mapa, layerUrl)
    .addTo(mapa)
    .on('done', function(layer) {
      layer.getSubLayer(0).set(subLayerOptions);
      layer.getSubLayer(0).infowindow.set('template', $('#' + _monta_infowindow(nurna)).html());
    }).on('error', function(err) {
      //log the error
      console.log(err);
    });
}
