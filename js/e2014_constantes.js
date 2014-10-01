var cores_partidos = {"PT": "#b70000", "PSTU":"#ce2200", "PCDOB":"#e5361f", "PCB":"#dd511f", "PSL":"#e26033", "PCO":"#e27037", "PSOL":"#e88900", "PMDB":"#f49600", "PROS":"#f2ad00", "PPL":"#efb600", "PSB":"#f4ba00", "PTB":"#f7c800", "PDT":"#ffcf06", "PPS":"#ffdb43", "SD":"#ffde55", "PSC":"#ffe966", "PTDOB":"#eded54", "PMN":"#d0e224", "PSD":"#bcd64d", "PEN":"#abc966", "PR":"#9ec666", "PV":"#97c281", "PP":"#8cbe8e", "PTC":"#71bca7", "PTN":"#4eb3c4", "PRB":"#4eaac6", "PSDC":"#5c9dc4", "PRTB":"#6195bc", "PHS":"#5e85b5", "PRP":"#5d7aba", "DEM":"#4966b7", "PSDB":"#4861bc"}

function _converte_numPartido_sigla(numero) {
    var conversao = {"21": "PCB", "54": "PPL","11": "PP","77": "SD","28": "PRTB","70": "PTDOB","33": "PMN","10": "PRB","55": "PSD","14": "PTB","51": "PEN","90": "PROS","13": "PT","45": "PSDB","15": "PMDB","50": "PSOL","31": "PHS","65": "PCDOB","20": "PSC","12": "PDT","22": "PR","40": "PSB","25": "DEM","16": "PSTU","17": "PSL","44": "PRP","29": "PCO","19": "PTN","27": "PSDC","43": "PV","36": "PTC","23": "PPS" }
    return conversao[numero];
}

//Dicionário com o ponto central escolhido para cada estado e o zoom com o qual ele deve ser apresentado
var estados = {'BR': { center: [-16.287239525774244,-55.51463843650], zoom: 4 },'AC': { center: [-10.982749041623823, -70.68940429687499], zoom: 6 },'AL': { center: [-11.084500864717155, -36.6009521484375], zoom: 7 },'AM': { center: [-8.561535597066094, -66.35791015625], zoom: 5 },'AP': { center: [1.463325357489324, -52.588427734375], zoom: 7 },'BA': { center: [-14.393038580274138, -42.146923828125], zoom: 6 },'CE': { center: [-5.50735844762961, -39.861767578125], zoom: 7 },'DF': { center: [-16.065822729893808, -47.819366455078125], zoom: 9 },'ES': { center: [-20.43051299702225, -40.5889892578125], zoom: 7 },'GO': { center: [-17.877960306212524, -49.361572265625], zoom: 6 },'MA': { center: [-6.766007882805485, -45.37353515625], zoom: 6 },'MG': { center: [-19.650219977065594, -45.42720703125], zoom: 6 },'MS': { center: [-21.396123272467616, -54.82177734374999], zoom: 6 },'MT': { center: [-13.175771224423402, -55.83251953125], zoom: 6 },'PA': { center: [-7.653079918274038, -54.88818359374999], zoom: 5 },'PB': { center: [-8.6425975109493255, -36.7767333984375], zoom: 7 },'PE': { center: [-10.352823015039577, -38.06762695312499], zoom: 6 },'PI': { center: [-8.044498849647323, -42.86865234375], zoom: 6 },'PR': { center: [-26.627044746156027, -51.65771484375], zoom: 6 },'RJ': { center: [-23.494179051660386, -43.06103515625], zoom: 7 },'RN': { center: [-7.347174076651375, -36.6778564453125 ], zoom: 7 },'RO': { center: [-12.398042159726009, -63.12744140625], zoom: 6 },'RR': { center: [0.2332268264771233, -62.34765625], zoom: 6 },'RS': { center: [-31.57786119581683, -53.618896484375], zoom: 6 },'SC': { center: [-28.364017546608678, -51.065576171875], zoom: 7 },'SE': { center: [-10.760607953624762, -37.66724853515625], zoom: 8 },'SP': { center: [-24.736945920943844,-49.30263671875], zoom: 6 },'TO': { center: [-10.48227924591501, -48.306884765625], zoom: 6 }};

// Modelos de CSS
// Um para mostrar os partidos que estão ganhando em cada
// área do mapa mostrado (sejam estados, sejam municípios)
// E outro modelo para mostrar o desemepenho de um único(a)
// candidato(a) em cada área do mapa mostrado.
var modelo_css = {
    '2014': {
        'vencedor': "#resultado_2014 {\
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
        'desempenho': "#resultado_2014{\
                        polygon-fill: #FFFFB2;\
                        polygon-opacity: 0.8;\
                        line-color: #333;\
                        line-width: 0.2;\
                        line-opacity: 0.5; }\
                      #resultado_2014 [ valor_perc <= 50] { polygon-fill: #B10026; }\
                      #resultado_2014 [ valor_perc <= 40] { polygon-fill: #FC4E2A; }\
                      #resultado_2014 [ valor_perc <= 30] { polygon-fill: #FEB24C; }\
                      #resultado_2014 [ valor_perc <= 20] { polygon-fill: #FED976; }\
                      #resultado_2014 [ valor_perc <= 10] { polygon-fill: #FFFFB2; }"
    },
    '2010': {
        'vencedor': "#resultado_2010 {\
                            polygon-opacity: 1;\
                            line-color: #444;\
                            line-width: 0.1;\
                            line-opacity: 0.3; }\
                          #resultado_2010[partido='PBAN'] { polygon-fill: #A6CEE3; }\
                          #resultado_2010[partido='PBAR'] { polygon-fill: #1F78B4; }\
                          #resultado_2010[partido='PLAN'] { polygon-fill: #B2DF8A; }\
                          #resultado_2010[partido='PGAL'] { polygon-fill: #33A02C; }\
                          #resultado_2010[partido='PJAG'] { polygon-fill: #FB9A99; }\
                          #resultado_2010[partido='PARA'] { polygon-fill: #E31A1C; }\
                          #resultado_2010[partido='PKUW'] { polygon-fill: #FDBF6F; }\
                          #resultado_2010[partido='PT'] { polygon-fill: " + cores_partidos['PT']  + "; }\
                          #resultado_2010[partido='PSTU'] { polygon-fill: " + cores_partidos['PSTU']  + "; }\
                          #resultado_2010[partido='PCDOB'] { polygon-fill: " + cores_partidos['PCDOB']  + "; }\
                          #resultado_2010[partido='PCB'] { polygon-fill: " + cores_partidos['PCB']  + "; }\
                          #resultado_2010[partido='PSL'] { polygon-fill: " + cores_partidos['PSL']  + "; }\
                          #resultado_2010[partido='PCO'] { polygon-fill: " + cores_partidos['PCO']  + "; }\
                          #resultado_2010[partido='PSOL'] { polygon-fill: " + cores_partidos['PSOL']  + "; }\
                          #resultado_2010[partido='PMDB'] { polygon-fill: " + cores_partidos['PMDB']  + "; }\
                          #resultado_2010[partido='PROS'] { polygon-fill: " + cores_partidos['PROS']  + "; }\
                          #resultado_2010[partido='PPL'] { polygon-fill: " + cores_partidos['PPL']  + "; }\
                          #resultado_2010[partido='PSB'] { polygon-fill: " + cores_partidos['PSB']  + "; }\
                          #resultado_2010[partido='PTB'] { polygon-fill: " + cores_partidos['PTB']  + "; }\
                          #resultado_2010[partido='PDT'] { polygon-fill: " + cores_partidos['PDT']  + "; }\
                          #resultado_2010[partido='PPS'] { polygon-fill: " + cores_partidos['PPS']  + "; }\
                          #resultado_2010[partido='SD'] { polygon-fill: " + cores_partidos['SD']  + "; }\
                          #resultado_2010[partido='PSC'] { polygon-fill: " + cores_partidos['PSC']  + "; }\
                          #resultado_2010[partido='PTDOB'] { polygon-fill: " + cores_partidos['PTDOB']  + "; }\
                          #resultado_2010[partido='PMN'] { polygon-fill: " + cores_partidos['PMN']  + "; }\
                          #resultado_2010[partido='PSD'] { polygon-fill: " + cores_partidos['PSD']  + "; }\
                          #resultado_2010[partido='PEN'] { polygon-fill: " + cores_partidos['PEN']  + "; }\
                          #resultado_2010[partido='PR'] { polygon-fill: " + cores_partidos['PR']  + "; }\
                          #resultado_2010[partido='PV'] { polygon-fill: " + cores_partidos['PV']  + "; }\
                          #resultado_2010[partido='PP'] { polygon-fill: " + cores_partidos['PP']  + "; }\
                          #resultado_2010[partido='PTC'] { polygon-fill: " + cores_partidos['PTC']  + "; }\
                          #resultado_2010[partido='PTN'] { polygon-fill: " + cores_partidos['PTN']  + "; }\
                          #resultado_2010[partido='PRB'] { polygon-fill: " + cores_partidos['PRB']  + "; }\
                          #resultado_2010[partido='PSDC'] { polygon-fill: " + cores_partidos['PSDC']  + "; }\
                          #resultado_2010[partido='PRTB'] { polygon-fill: " + cores_partidos['PRTB']  + "; }\
                          #resultado_2010[partido='PHS'] { polygon-fill: " + cores_partidos['PHS']  + "; }\
                          #resultado_2010[partido='PRP'] { polygon-fill: " + cores_partidos['PRP']  + "; }\
                          #resultado_2010[partido='DEM'] { polygon-fill: " + cores_partidos['DEM']  + "; }\
                          #resultado_2010[partido='PSDB'] { polygon-fill: " + cores_partidos['PSDB']  + "; }",
        'desempenho': "#resultado_2010{\
                        polygon-fill: #FFFFB2;\
                        polygon-opacity: 0.8;\
                        line-color: #333;\
                        line-width: 0.2;\
                        line-opacity: 0.5; }\
                      #resultado_2010 [ valor_perc <= 50] { polygon-fill: #B10026; }\
                      #resultado_2010 [ valor_perc <= 40] { polygon-fill: #FC4E2A; }\
                      #resultado_2010 [ valor_perc <= 30] { polygon-fill: #FEB24C; }\
                      #resultado_2010 [ valor_perc <= 20] { polygon-fill: #FED976; }\
                      #resultado_2010 [ valor_perc <= 10] { polygon-fill: #FFFFB2; }"
    }
}
