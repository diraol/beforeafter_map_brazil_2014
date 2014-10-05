String.prototype.capitalize = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function _getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function _monta_subLayerOptions(ano,cargo,uf,nurna) {
    var opcoes = {};
    opcoes['sql'] = _monta_query(ano, cargo, uf, nurna);
    opcoes['cartocss'] = _monta_cartocss({ano: ano, nurna: nurna, uf: uf });
    /*
     * ca = cargo
     * es = estado
     * nu = num_urna_cand
     * no = nome_de_urna
     * vp = valor_perc
     * va = valor_abs
     * p = perc
     * cid = nome_ibge_com_acento
     * t = turno
    */
    if (uf == "" || uf == "BR") {
        opcoes['interactivity'] = ['ca','estado','uf','nu','vp','p'];
    } else {
            opcoes['interactivity'] = ['ca','estado','uf','cid','cod_tse_municipio','nu','vp','p'];
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
    query =  "SELECT";
    query +=    " E.the_geom_webmercator,";
    query +=    " E.estado,"
    query +=    " E.uf,";
    query +=    " R.turno as t,";
    query +=    " 'Presidente' as ca,";
    query +=    " max(R.cartodb_id) as cartodb_id,";
    query +=    " max(R.valor_perc) as vp,";
    query +=    " (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as nu,";
    query +=    " (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as p ";
    query += " FROM ";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.poligonosestados E";
    query += " WHERE";
    query +=    " R.estado = E.uf AND";
    query +=    " R.cod_tse_municipio is null";
    query += " GROUP BY";
    query +=    " E.the_geom_webmercator,";
    query +=    " E.estado,";
    query +=    " E.uf,";
    query +=    " R.turno";
  } else if ((cargo == "" || cargo == "presidente") && (uf == "" || uf == "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Sem estado definido - mostra mapa nacional com divisões e totalizações estaduais
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada estado
    query =  "SELECT";
    query +=    " R.cartodb_id,";
    query +=    " E.the_geom_webmercator,";
    query +=    " E.estado,";
    query +=    " E.uf,";
    query +=    " 'Presidente' as ca,";
    query +=    " R.num_urna_cand as nu,";
    query +=    " R.turno as t,";
    query +=    " R.valor_abs as va,";
    query +=    " R.valor_perc as vp,";
    query +=    " R.partido as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.poligonosestados E";
    query += " WHERE";
    query +=    " R.estado = E.uf AND";
    query +=    " R.cargo_cand = 1 AND";
    query +=    " R.cod_tse_municipio is null AND";
    query +=    " R.num_urna_cand = " + nurna;
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna == "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    query =  "SELECT";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " R.turno as t,";
    query +=    " 'Presidente' as ca,";
    query +=    " max(R.cartodb_id) as cartodb_id,";
    query +=    " max(R.valor_perc) as vp,";
    query +=    " (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as nu,";
    query +=    " (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = '" + uf + "' AND";
    query +=    " M.estado = '" + uf + "' AND";
    query +=    " R.cargo_cand = 1 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse";
    query += " GROUP BY";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " uf,";
    query +=    " R.turno";
  } else if ((cargo == "" || cargo == "presidente") && (uf != "" && uf != "BR") && (nurna != "")) {
    // Cargo Presidencial
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    query =  "SELECT";
    query +=    " R.cartodb_id,";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " 'Presidente' as ca,";
    query +=    " R.num_urna_cand as nu,";
    query +=    " R.turno as t,";
    query +=    " R.valor_abs as va,";
    query +=    " R.valor_perc as vp,";
    query +=    " R.partido as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = '" + uf + "' AND";
    query +=    " M.estado = '" + uf + "' AND";
    query +=    " R.cargo_cand = 1 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse AND";
    query +=    " R.num_urna_cand = '" + nurna + "'";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna == "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    query = "SELECT";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " R.cod_tse_municipio,";
    query +=    " R.turno as t,";
    query +=    " 'Governador' as ca,";
    query +=    " max(R.cartodb_id) as cartodb_id,";
    query +=    " max(R.valor_perc) as vp,";
    query +=    " (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as nu,";
    query +=    " (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = 'SP' AND";
    query +=    " M.estado = 'SP' AND";
    query +=    " R.cargo_cand = 3 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse";
    query += " GROUP BY";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento,";
    query +=    " M.estado,";
    query +=    " uf,";
    query +=    " R.cod_tse_municipio,";
    query +=    " R.turno";
  } else if ((cargo == "governador") && (uf == "" || uf == "SP") && (nurna != "")) {
    // Cargo Governador
    // Sem estado definido (ou SP, que é Default) - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    query =  "SELECT";
    query +=    " R.cartodb_id,";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " 'Governador' as ca,";
    query +=    " R.num_urna_cand as nu,";
    query +=    " R.turno as t,";
    query +=    " R.valor_abs as va,";
    query +=    " R.valor_perc as vp,";
    query +=    " R.partido as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = 'SP' AND";
    query +=    " M.estado = 'SP' AND";
    query +=    " R.cargo_cand = 3 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse AND";
    query +=    " R.num_urna_cand = '" + nurna + "'";
  } else if ((cargo == "governador") && (uf != "") && (nurna == "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Sem nurna - Vencedor em cada município
    query =  "SELECT";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " R.turno as t,";
    query +=    " 'Governador' as ca,";
    query +=    " max(R.cartodb_id) as cartodb_id,";
    query +=    " max(R.valor_perc) as vp,";
    query +=    " (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as nu,";
    query +=    " (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = '" + uf + "' AND";
    query +=    " M.estado = '" + uf + "' AND";
    query +=    " R.cargo_cand = 3 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse";
    query += " GROUP BY";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " uf,";
    query +=    " R.turno";
  } else if ((cargo == "governador") && (uf != "") && (nurna != "")) {
    // Cargo Governador
    // Com estado definido - mostra o mapa do estado, com as divisões municipais do estado, totalizado por município
    // Com nurna - Candidato selecionado - Mostra o "resultado geral" do candidato em cada município
    query =  "SELECT";
    query +=    " R.cartodb_id,";
    query +=    " M.the_geom_webmercator,";
    query +=    " M.nome_ibge_com_acento as cid,";
    query +=    " R.cod_tse_municipio,";
    query +=    " M.estado,";
    query +=    " M.estado as uf,";
    query +=    " 'Governador' as ca,";
    query +=    " R.num_urna_cand as nu,";
    query +=    " R.turno as t,";
    query +=    " R.valor_abs as va,";
    query +=    " R.valor_perc as vp,";
    query +=    " R.partido as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.municipios_tse M";
    query += " WHERE";
    query +=    " R.estado = '" + uf + "' AND";
    query +=    " M.estado = '" + uf + "' AND";
    query +=    " R.cargo_cand = 3 AND";
    query +=    " R.cod_tse_municipio = M.cod_tse AND";
    query +=    " R.num_urna_cand = '" + nurna + "'";
  } else {
    //default query
    query =  "SELECT";
    query +=    " E.the_geom_webmercator,";
    query +=    " E.estado,";
    query +=    " E.uf,";
    query +=    " R.turno as t,";
    query +=    " 'Presidente' as ca,";
    query +=    " max(R.cartodb_id) as cartodb_id,";
    query +=    " max(R.valor_perc) as vp,";
    query +=    " (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as nu,";
    query +=    " (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as p";
    query += " FROM";
    query +=    " urna2014.resultado_" + ano + "_production R,";
    query +=    " estadao.poligonosestados E";
    query += " WHERE";
    query +=    " R.estado = E.estado AND";
    query +=    " R.cargo_cand = 1";
    query += " GROUP BY";
    query +=    " E.the_geom_webmercator,";
    query +=    " E.estado,";
    query +=    " E.uf,";
    query +=    " R.turno";
  }
  return query;
}

function _monta_cartocss(opcoes) {
  //Montagem do CartoCSS
  //  São 2 casos, o primeiro sem candidato definido que vai mostrar os líderes de cada área
  //  e o segundo com candidato definido, que vai mostrar um 'Choropleth' na região
  //
  //Opções:
  //    ano
  //    nurna
  //    uf

  var cartocss = "";

  if (opcoes['nurna'] != "") {
    cartocss += "#r{";
    cartocss += "polygon-fill:" + cores_partidos[_converte_numPartido_sigla(opcoes['nurna'])] + ";";
    cartocss += "polygon-opacity:1;";
    cartocss += "line-color:#fff;";
    cartocss += "line-opacity:0.8;";
    if (opcoes['uf'] == "BR" || opcoes['uf']== "") cartocss += "line-width:1;}";
    else cartocss += "line-width:0.5;}";
    cartocss += "#r[vp<65]{polygon-opacity:0.66;}";
    cartocss += "#r[vp<25]{polygon-opacity:0.33;}";
    cartocss += "#r[vp=0]{polygon-opacity:0;line-color:#000;}";
  } else {
    cartocss += "#r{";
    cartocss += "polygon-fill:#ccc;";
    cartocss += "polygon-opacity:1;";
    cartocss += "line-color:#fff;";
    cartocss += "line-opacity:0.8;";
    if (opcoes['uf'] == "BR" || opcoes['uf']== "") cartocss += "line-width:1;}";
    else cartocss += "line-width:0.5;}";
    $.each(cores_partidos, function(partido, cor){
        cartocss += "#r[p='" + partido + "']{polygon-fill:" + cor + ";}";
    });
    cartocss += "#r[vp<50]{polygon-opacity:0.50;}";
    cartocss += "#r[vp=0]{polygon-opacity:0;line-color:#000;}";
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
    var tooltip_data = "<center><b>" + local + " - " + cargo + " - "+ano+"</b></center>",
        contador = 0;
    tooltip_data += "<div>";
    $.each(dados, function(key,val){
        if (contador % 4 == 0 && contador > 0) {
            tooltip_data += "</div><div>"
        }
        tooltip_data += "<p>" + val.no.capitalize(true) + " (" + val.p + ") - " + val.vp + "%</p>";
        contador++;
    });
    tooltip_data += "</div>";
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

    /* O que será selecionado */
    query += "SELECT ";
    query +=    "R.num_urna_cand as nu, ";
    query +=    "R.partido as p, ";
    query +=    "R.valor_abs as va, ";
    query +=    "R.valor_perc as vp, ";
    query +=    "C.nome_de_urna as no ";
    /* De onde será feita a seleção */
    query += "FROM ";
    query +=    "urna2014.resultado_" + ano + "_production R, ";
    query +=    "urna2014.candidatos_" + ano + " C ";
    /* Quais são as restrições e condições */
    query += "WHERE ";
    query +=    "R.cargo_cand = " + cargo + " AND ";
    query +=    "C.cargo_cand = " + cargo + " AND ";
    query +=    "R.num_urna_cand = C.num_partido AND ";
    query +=    "R.partido = C.sigla_partido AND ";
    query +=    "R.estado = '" + uf +"' AND ";
    if (cargo == "3") { query +=    "C.estado = '" + uf +"' AND "; }// cargo = governador
    if (uf_viz == "" || uf_viz == "BR") { query += "R.cod_tse_municipio is null "; } else { query += "R.cod_tse_municipio='" + cod_tse_municipio + "' "; }
    query += "ORDER BY ";
    query +=    "vp DESC";

    return query;
}
