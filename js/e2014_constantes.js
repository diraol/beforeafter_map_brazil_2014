var cores_partidos = {'PT': "#dd3030", 'PSB': "#ffba34", 'PSDB': "#274fb3", 'PSC': "#438438", 'PSOL': "#ffc887", 'PMDB': "#9fde71", 'PSD': "#71afde", 'DEM': "#00c0ff", 'PSTU': "#f56bb9", 'PRTB': "#c6c063", 'PSDC': "#5155df", 'PDT': "#ff5569", 'PTdoB': "#77bc26", 'PR': "#484b73", 'PPL': "#194423", 'PCdoB': "#aa7800", 'PTC': "#0074aa", 'PROS': "#ff7200", 'PP': "#0c2470", 'PPS': "#974d36", 'PTB': "#202020", 'PTN': "#255b57", 'PRP': "#0adfcd", 'PSL': "#7ebaae", 'SDD': "#855a9e", 'PHS': "#d4ccb2"}

//Dicionário com o ponto central escolhido para cada estado e o zoom com o qual ele deve ser apresentado
var estados = {'BR': { center: [-17.987239525774244,-55.51463843650], zoom: 4 },'AC': { center: [-10.982749041623823, -70.68940429687499], zoom: 6 },'AL': { center: [-11.084500864717155, -36.6009521484375], zoom: 7 },'AM': { center: [-8.561535597066094, -66.35791015625], zoom: 5 },'AP': { center: [1.463325357489324, -52.588427734375], zoom: 7 },'BA': { center: [-14.393038580274138, -42.146923828125], zoom: 6 },'CE': { center: [-5.50735844762961, -39.861767578125], zoom: 7 },'DF': { center: [-16.065822729893808, -47.819366455078125], zoom: 9 },'ES': { center: [-20.43051299702225, -40.5889892578125], zoom: 7 },'GO': { center: [-17.877960306212524, -49.361572265625], zoom: 6 },'MA': { center: [-6.766007882805485, -45.37353515625], zoom: 6 },'MG': { center: [-19.650219977065594, -45.42720703125], zoom: 6 },'MS': { center: [-21.396123272467616, -54.82177734374999], zoom: 6 },'MT': { center: [-13.175771224423402, -55.83251953125], zoom: 6 },'PA': { center: [-7.653079918274038, -54.88818359374999], zoom: 5 },'PB': { center: [-8.6425975109493255, -36.7767333984375], zoom: 7 },'PE': { center: [-10.352823015039577, -38.06762695312499], zoom: 6 },'PI': { center: [-8.044498849647323, -42.86865234375], zoom: 6 },'PR': { center: [-26.627044746156027, -51.65771484375], zoom: 6 },'RJ': { center: [-23.494179051660386, -43.06103515625], zoom: 7 },'RN': { center: [-7.347174076651375, -36.6778564453125 ], zoom: 7 },'RO': { center: [-12.398042159726009, -63.12744140625], zoom: 6 },'RR': { center: [0.2332268264771233, -62.34765625], zoom: 6 },'RS': { center: [-31.57786119581683, -53.618896484375], zoom: 6 },'SC': { center: [-28.364017546608678, -51.065576171875], zoom: 7 },'SE': { center: [-10.760607953624762, -37.66724853515625], zoom: 8 },'SP': { center: [-24.736945920943844,-49.30263671875], zoom: 6 },'TO': { center: [-10.48227924591501, -48.306884765625], zoom: 6 }};

// Modelos de CSS
// Um para mostrar os partidos que estão ganhando em cada
// área do mapa mostrado (sejam estados, sejam municípios)
// E outro modelo para mostrar o desemepenho de um único(a)
// candidato(a) em cada área do mapa mostrado.
var modelo_css = {
    '2015': {
        'vencedor': "#resultado_2015 {\
                            polygon-opacity: 0.5;\
                            line-color: #444;\
                            line-width: 0.1;\
                            line-opacity: 0.3; }\
                          #resultado_2015[partido='PBAN'] { polygon-fill: #A6CEE3; }\
                          #resultado_2015[partido='PBAR'] { polygon-fill: #1F78B4; }\
                          #resultado_2015[partido='PLAN'] { polygon-fill: #B2DF8A; }\
                          #resultado_2015[partido='PGAL'] { polygon-fill: #33A02C; }\
                          #resultado_2015[partido='PJAG'] { polygon-fill: #FB9A99; }\
                          #resultado_2015[partido='PARA'] { polygon-fill: #E31A1C; }\
                          #resultado_2015[partido='PKUW'] { polygon-fill: #FDBF6F; }\
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
        'desempenho': "#resultado_2015{\
                        polygon-fill: #FFFFB2;\
                        polygon-opacity: 0.8;\
                        line-color: #333;\
                        line-width: 0.2;\
                        line-opacity: 0.5; }\
                      #resultado_2015 [ valor_perc <= 50] { polygon-fill: #B10026; }\
                      #resultado_2015 [ valor_perc <= 40] { polygon-fill: #FC4E2A; }\
                      #resultado_2015 [ valor_perc <= 30] { polygon-fill: #FEB24C; }\
                      #resultado_2015 [ valor_perc <= 20] { polygon-fill: #FED976; }\
                      #resultado_2015 [ valor_perc <= 10] { polygon-fill: #FFFFB2; }"
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
