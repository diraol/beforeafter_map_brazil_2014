String.prototype.capitalize = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

var subLayers = [];

function _getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function _build_subLayerOptions(year, round, cargo, uf, nurna) {
    var options = {};
    options['sql'] = _map_query(year, round, cargo, uf, nurna);
    options['cartocss'] = _build_cartocss({year: year, round: round, nurna: nurna, uf: uf });
    /*
     * es = estado
     * nu = nurna
     * no = nome_de_urna
     * vp = valor_perc
     * va = valor_abs
     * p = perc
     * cid = nome_ibge_com_acento
     * t = turno
    */
    if (uf == "" || uf == "BR") {
        options['interactivity'] = ['uf','nurna','valor_perc','partido'];
    } else {
        options['interactivity'] = ['uf','cod_tse','nom_mun','nurna','valor_perc','partido'];
    }
    if (round == 2 && nurna == "") {
        options['interactivity'] = options['interactivity'].concat(['nurna2','valor_perc2','partido2']);
    }
    return options;
}

function _map_query(year, round, cargo, uf, nurna) {
    /*  year = year of election
        cargo = president or governor
        uf = Area (Country or State)
        nurna = number of candidate
        round = round of election (1st or 2nd)
     */
    var cargo = cargo.toLowerCase() == "presidente" ? 1 : 3 ;

    // ****** SELECT PARAMETERS ******
    var query = "SELECT ";

    query += "S.the_geom_webmercator, ";
    query += "S.nom_uf as uf, "; // State acronym
    if (uf != "BR") {
        query += "S.cod_tse, ";// city code for electoral justice
        query += "S.nom_mun, "; // name of city
    }
    if (nurna == "") {
        /* On this case, the map will be colored based on the leader of each state */
        // percent_value of the candidate
        query += "max(R.valor_perc) as valor_perc, ";
        // the number of the candidate
        query += "(array_agg(R.nurna ORDER BY valor_perc DESC, partido ASC))[1] as nurna, ";
        // partie of the candidate
        query += "(array_agg(R.partido ORDER BY valor_perc DESC, partido ASC))[1] as partido, ";
        if (round == 2) {
            // percent_value of the candidate
            query += "min(R.valor_perc) as valor_perc2, ";
            // the number of the candidate
            query += "(array_agg(R.nurna ORDER BY valor_perc ASC, partido DESC))[1] as nurna2, ";
            // partie of the candidate
            query += "(array_agg(R.partido ORDER BY valor_perc ASC, partido DESC))[1] as partido2, ";
        }
        //
        query += "max(R.cartodb_id) as cartodb_id ";

    } else {
        /* on this case, the map will be colored based on the performance of the candidate, using a choroplet */
        query += "R.cartodb_id, ";
        // percent_value of the candidate
        query += "R.valor_perc, ";
        // the number of the candidate
        query += "R.nurna as nurna, ";
        // partie of the candidate
        query += "R.partido ";
    }

    // ****** FROM PARAMETERS ******
    query += "FROM ";
    if (uf == "BR") {
        // Select the country shape with the States
        query += "bases.ufs as S, "; // S for SHAPE
    } else {
        // Select the shape with cities
        query += "bases.municipios as S, ";
    }
    // table with election results
    query += "urna2014.resultado_" + year + "_" + round + " as R "; // R for result

    // ****** WHERE CLAUSES ******
    query += "WHERE ";
    query += "R.cargo = " + cargo + " AND ";
    if (nurna != "") {
        query += "R.nurna = " + nurna + " AND ";
    }
    if (uf == "BR") {
        query += "R.uf = S.UF AND ";
        query += "R.cod_tse is null ";
    } else {
        query += "R.uf = '" + uf + "' AND ";
        query += "S.uf = '" + uf + "' AND ";
        query += "R.cod_tse = S.cod_tse ";
    }

    // ****** GROUP BY CLAUSE ******
    if (nurna == "") {
        query += "GROUP BY ";
        query += "S.the_geom_webmercator, ";
        if (uf != "BR") {
            query += "S.nom_mun, ";
            query += "R.cod_tse, ";
            query += "S.cod_tse, ";
        }
        query += "S.nom_uf";
    }
    console.log(query);
    return query;
}

function _build_cartocss(options) {
  /* Build CartoCSS
        There are 2 cases.
        The first one without a specific candidate, that will show how leads in each area.
        The second one with a specific candidate, that will use a Choropleth for the candidate.

    Options:
        year
        round
        nurna // number of the candidate
        uf // selected state (or country "BR")
  */

  var cartocss = "";

  cartocss += "#r{ ";
  cartocss += "polygon-opacity:1;";
  cartocss += "line-color:#fff;";
  cartocss += "line-opacity:0.8;";
  if (options['uf'] == "BR" || options['uf'] == "") {
      cartocss += "line-width:1;";
  } else if (options['nurna'] != "") {
      cartocss += "line-width:0.5;";
  } else {
      cartocss += "line-width:0.3;";
  }
  if (options['nurna'] != "") {
    cartocss += "polygon-fill:" + partie_color[_partie_num_to_acronym(options['nurna'])] + ";}";
    cartocss += "#r[valor_perc<65]{polygon-opacity:0.66;}";
    cartocss += "#r[valor_perc<25]{polygon-opacity:0.33;}";
    cartocss += "#r[valor_perc=0]{polygon-opacity:0;line-color:#000;}";
  } else {
      cartocss += "polygon-fill:#ccc;}";
      $.each(partie_color, function(partido, cor){
          cartocss += "#r[partido='" + partido + "']{polygon-fill:" + cor + ";}";
      });
      if (options['round'] == 1) {
          cartocss += "#r[valor_perc<50]{polygon-opacity:0.50;}";
          cartocss += "#r[valor_perc=0]{polygon-opacity:0;line-color:#000;}";
      } else {
          cartocss += "#r[valor_perc<65]{polygon-opacity:0.50;}";
          cartocss += "#r[valor_perc=0]{polygon-opacity:0;line-color:#000;}";

      }
  }

  return cartocss;
}

function _build_tooltip(place, cargo, data, year) {
    var tooltip_data = "<center><b>" + place + " - " + cargo + " - " + year + "</b></center>",
        counter = 0;
    tooltip_data += "<div>";
    $.each(data, function(key, val){
        if (counter % 4 == 0 && counter > 0) {
            tooltip_data += "</div><div>"
        }
        tooltip_data += "<p>" + val.name.capitalize(true) + " (" + val.partie + ") - " + val.valor_perc + "%</p>";
        counter++;
    });
    tooltip_data += "</div>";
    return tooltip_data;
}

function _numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function _build_tooltip_query(year, round, cargo, uf_viz, uf, cod_tse_municipio){
    //uf_viz é a variável de controle de qual visualização está sendo mostrada, se é nacional ou estadual.
    //uf é a informação sobre qual é a UF sobre a qual o usuário está passando o mouse no momento.

    var query = "http://urna2014.cartodb.com/api/v2/sql?q=",
        cargo = cargo.toLowerCase()=="presidente" ? 1 : 3;

    // ****** SELECT PARAMETERS ******
    query += "SELECT ";
    query += "R.partido as partie, ";
    query += "R.valor_perc as valor_perc, ";
    query += "C.nome_de_urna as name ";

    // ****** FROM PARAMETERS ******
    query += "FROM ";
    query += "urna2014.resultado_" + year + "_" + round + " R, "; //results
    query += "urna2014.candidatos_" + year + " C "; // candidates

    // ****** WHERE CLAUSES ******
    query += "WHERE ";
    query += "R.cargo_cand = " + cargo + " AND ";
    query += "C.cargo_cand = " + cargo + " AND ";
    query += "R.nurna = C.num_partido AND ";
    query += "R.partido = C.sigla_partido AND ";
    query += "R.uf = '" + uf +"' AND ";
    if (cargo == "3") { query +=    "C.uf = '" + uf +"' AND "; }// cargo = governador
    if (uf_viz == "" || uf_viz == "BR") {
        query += "R.cod_tse is null ";
    } else {
        query += "R.cod_tse ='" + cod_tse_municipio + "' ";
    }

    // ****** ORDER BY CLAUSE ******
    query += "ORDER BY ";
    query += "valor_perc DESC";

    return query;
}
