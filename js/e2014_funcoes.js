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
    if (uf == "" || uf == "BR") {
        opcoes['interactivity'] = ['cargo','estado','uf','num_urna_cand','valor_perc','partido'];
    } else {
        opcoes['interactivity'] = ['cargo','estado','uf','nome_ibge_com_acento','cod_tse_municipio','num_urna_cand','valor_perc','partido'];
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
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               R.turno,\
               'Presidente' as cargo,\
               max(R.cartodb_id) as cartodb_id,\
               max(R.valor_perc) as valor_perc,\
               (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as num_urna_cand,\
               (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido\
             FROM\
               urna2014.resultado_" + ano + "_production R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.uf AND\
               R.cod_tse_municipio is null\
             GROUP BY\
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               R.turno";
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
               urna2014.resultado_" + ano + "_production R,\
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
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               R.turno,\
               'Presidente' as cargo,\
               max(R.cartodb_id) as cartodb_id,\
               max(R.valor_perc) as valor_perc,\
               (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as num_urna_cand,\
               (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido\
             FROM\
               urna2014.resultado_" + ano + "_production R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 1 AND\
               R.cod_tse_municipio = M.cod_tse\
             GROUP BY\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               uf,\
               R.turno";
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
               urna2014.resultado_" + ano + "_production R,\
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
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               M.estado as uf,\
               R.cod_tse_municipio,\
               R.turno,\
               'Governador' as cargo,\
               max(R.cartodb_id) as cartodb_id,\
               max(R.valor_perc) as valor_perc,\
               (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as num_urna_cand,\
               (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido\
             FROM\
               urna2014.resultado_" + ano + "_production R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = 'SP' AND\
               M.estado = 'SP' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             GROUP BY\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               M.estado,\
               uf,\
               R.cod_tse_municipio,\
               R.turno";
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
               urna2014.resultado_" + ano + "_production R,\
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
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               M.estado as uf,\
               R.turno,\
               'Governador' as cargo,\
               max(R.cartodb_id) as cartodb_id,\
               max(R.valor_perc) as valor_perc,\
               (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as num_urna_cand,\
               (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido\
             FROM\
               urna2014.resultado_" + ano + "_production R,\
               estadao.municipios_tse M\
             WHERE\
               R.estado = '" + uf + "' AND\
               M.estado = '" + uf + "' AND\
               R.cargo_cand = 3 AND\
               R.cod_tse_municipio = M.cod_tse\
             GROUP BY\
               M.the_geom_webmercator,\
               M.nome_ibge_com_acento,\
               R.cod_tse_municipio,\
               M.estado,\
               uf,\
               R.turno";
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
               urna2014.resultado_" + ano + "_production R,\
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
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               R.turno,\
               'Presidente' as cargo,\
               max(R.cartodb_id) as cartodb_id,\
               max(R.valor_perc) as valor_perc,\
               (array_agg(R.num_urna_cand ORDER BY valor_perc DESC, partido ASC))[1] as num_urna_cand,\
               (array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido\
             FROM\
               urna2014.resultado_" + ano + "_production R,\
               estadao.poligonosestados E\
             WHERE\
               R.estado = E.estado AND\
               R.cargo_cand = 1\
             GROUP BY\
               E.the_geom_webmercator,\
               E.estado,\
               E.uf,\
               R.turno";
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
    cartocss += "#r[valor_perc<65]{polygon-opacity:0.66;}";
    cartocss += "#r[valor_perc<25]{polygon-opacity:0.33;}";
    cartocss += "#r[valor_perc=0]{polygon-opacity:0;line-color:#000;}";
  } else {
    cartocss += "#r{";
    cartocss += "polygon-fill:#ccc;";
    cartocss += "polygon-opacity:1;";
    cartocss += "line-color:#fff;";
    cartocss += "line-opacity:0.8;";
    if (opcoes['uf'] == "BR" || opcoes['uf']== "") cartocss += "line-width:1;}";
    else cartocss += "line-width:0.5;}";
    $.each(cores_partidos, function(partido, cor){
        cartocss += "#r[partido='" + partido + "']{polygon-fill:" + cor + ";}";
    });
    cartocss += "#r[valor_perc<50]{polygon-opacity:0.50;}";
    cartocss += "#r[valor_perc=0]{polygon-opacity:0;line-color:#000;}";
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
        tooltip_data += "<p>" + val.nu.capitalize(true) + " (" + val.p + ") - " + val.vp + "%</p>";
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
    query +=    "R.num_urna_cand as num, ";
    query +=    "R.partido as p, ";
    query +=    "R.valor_abs as va, ";
    query +=    "R.valor_perc as vp, ";
    query +=    "C.nome_de_urna as nu ";
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
