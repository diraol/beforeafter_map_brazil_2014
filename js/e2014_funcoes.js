function _getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function _monta_subLayerOptions(ano,cargo,uf,nurna) {
    var opcoes = {};
    opcoes['sql'] = _monta_query(ano, cargo, uf, nurna);
    opcoes['cartocss'] = _monta_cartocss(ano,nurna);
    if (uf == "" || uf == "BR") {
        opcoes['interactivity'] = ['cargo','estado','uf','num_urna_cand','valor_abs','valor_perc','partido'];
    } else {
        opcoes['interactivity'] = ['cargo','estado','uf','nome_ibge_com_acento','cod_tse_municipio','num_urna_cand','valor_abs','valor_perc','partido'];
    }
    return opcoes;
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
               E.uf,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
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
               cartodb_id";
  } else if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Sem estado definido - mostra mapa nacional com divisões e totalizações estaduais
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada estado
    query = "SELECT\
               R.cartodb_id,\
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.uf AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio is null AND\
               R.num_urna_cand = " + nurna;
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna == "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna == "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = 'SP' AND\
               M.estado = 'SP' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna != "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = 'SP' AND\
               M.estado = 'SP' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
  } else if ((cargo == "governador") && (uf != "") && (nurna == "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             ORDER BY\
               valor_perc,\
               cartodb_id";
  } else if ((cargo == "governador") && (uf != "") && (nurna != "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    // TODO: Acertar o zoom e localização (centro) de cada estado
    query = "SELECT\
               R.cartodb_id,\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               'Governador' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse AND\
               R.num_urna_cand = '" + nurna + "'";
  } else {
    //default query
    query = "SELECT\
               R.cartodb_id,\
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               'Presidente' as cargo,\
               R.num_urna_cand,\
               R.turno,\
               R.valor_abs,\
               R.valor_perc,\
               R.partido\
             FROM\
               urna2014.resultado_" + ano + " R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.estado AND\
               R.cargo_cand = 1\
             ORDER BY\
               valor_perc,\
               cartodb_id";
  }
    return query;
}

function _monta_cartocss(ano,nurna) {
  //Montagem do CartoCSS
  //  São 2 casos, o primeiro sem candidato definido que vai mostrar os líderes de cada área
  //  e o segundo com candidato definido, que vai mostrar um 'Choropleth' na região
  var cartocss = "";
  if (nurna == "") {
    cartocss = modelo_css[ano]['vencedor']

  } else {
    cartocss = modelo_css[ano]['desempenho']
  }
  return cartocss;
}

function _monta_infowindow(cargo, uf, nurna) {

  var template = "";

  if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna == "")) {
    template = "#infowindow_template_nacional";
  } else if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna != "")) {
    template = "#infowindow_template_nacional";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna == "")) {
    template = "#infowindow_template_estadual";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna != "")) {
    template = "#infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna == "")) {
    template = "#infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna != "")) {
    template = "#infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf != "") && (nurna == "")) {
    template = "#infowindow_template_estadual";
  } else if ((cargo == "governador") && (uf != "") && (nurna != "")) {
    template = "#infowindow_template_estadual";
  } else {
    template = "#infowindow_template_nacional";
  }

  return template;
}

function _monta_tooltip(local, cargo, dados, ano) {
    var tooltip_data = "<b>"+ano+"</b></br>";
        tooltip_data += "<b>" + local + " - " + cargo + "</b><br/>"
        $.each(dados, function(key,val){
            tooltip_data += "" + val.num_urna_cand + " (" + val.partido + ") - " + val.valor_perc + "% (" + _numberWithDots(val.valor_abs) + ")</br>"
        });
    return tooltip_data;
}

function _numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function _monta_tooltip_query(ano, cargo, uf_viz, uf, cod_tse_municipio){
    //uf_viz é a variável de controle de qual visualização está sendo mostrada, se é nacional ou estadual.
    //uf é a informação sobre qual é a UF sobre a qual o usuário está passando o mouse no momento.

    var query = "http://urna2014.cartodb.com/api/v2/sql?q=",
        cargo = cargo=="presidente" ? 1 : 3;

    query += "SELECT num_urna_cand, partido, valor_abs, valor_perc from urna2014.resultado_" + ano + " WHERE cargo_cand = " + cargo;

    if (uf_viz == "" || uf_viz == "BR") {
        query += " AND cod_tse_municipio is null AND estado='" + uf + "' ORDER BY valor_perc DESC";
    } else {
        query += " AND cod_tse_municipio='" + cod_tse_municipio + "' AND estado='" + uf + "' ORDER BY valor_perc DESC";
    }
    return query;
}
