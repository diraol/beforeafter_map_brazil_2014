var cores_partidos = {'PT': "#dd3030", 'PSB': "#ffba34", 'PSDB': "#274fb3", 'PSC': "#438438", 'PSOL': "#ffc887", 'PMDB': "#9fde71", 'PSD': "#71afde", 'DEM': "#00c0ff", 'PSTU': "#f56bb9", 'PRTB': "#c6c063", 'PSDC': "#5155df", 'PDT': "#ff5569", 'PTdoB': "#77bc26", 'PR': "#484b73", 'PPL': "#194423", 'PCdoB': "#aa7800", 'PTC': "#0074aa", 'PROS': "#ff7200", 'PP': "#0c2470", 'PPS': "#974d36", 'PTB': "#202020", 'PTN': "#255b57", 'PRP': "#0adfcd", 'PSL': "#7ebaae", 'SDD': "#855a9e", 'PHS': "#d4ccb2"}

//Dicionário com o ponto central escolhido para cada estado e o zoom com o qual ele deve ser apresentado
var estados = {'BR': { center: [-17.987239525774244,-55.51463843650], zoom: 4 },'AC': { center: [-10.982749041623823, -70.68940429687499], zoom: 6 },'AL': { center: [-11.084500864717155, -36.6009521484375], zoom: 7 },'AM': { center: [-8.561535597066094, -66.35791015625], zoom: 5 },'AP': { center: [1.463325357489324, -52.588427734375], zoom: 7 },'BA': { center: [-14.393038580274138, -42.146923828125], zoom: 6 },'CE': { center: [-5.50735844762961, -39.861767578125], zoom: 7 },'DF': { center: [-16.065822729893808, -47.819366455078125], zoom: 9 },'ES': { center: [-20.43051299702225, -40.5889892578125], zoom: 7 },'GO': { center: [-17.877960306212524, -49.361572265625], zoom: 6 },'MA': { center: [-6.766007882805485, -45.37353515625], zoom: 6 },'MG': { center: [-19.650219977065594, -45.42720703125], zoom: 6 },'MS': { center: [-21.396123272467616, -54.82177734374999], zoom: 6 },'MT': { center: [-13.175771224423402, -55.83251953125], zoom: 6 },'PA': { center: [-7.653079918274038, -54.88818359374999], zoom: 5 },'PB': { center: [-8.6425975109493255, -36.7767333984375], zoom: 7 },'PE': { center: [-10.352823015039577, -38.06762695312499], zoom: 6 },'PI': { center: [-8.044498849647323, -42.86865234375], zoom: 6 },'PR': { center: [-26.627044746156027, -51.65771484375], zoom: 6 },'RJ': { center: [-23.494179051660386, -43.06103515625], zoom: 7 },'RN': { center: [-7.347174076651375, -36.6778564453125 ], zoom: 7 },'RO': { center: [-12.398042159726009, -63.12744140625], zoom: 6 },'RR': { center: [0.2332268264771233, -62.34765625], zoom: 6 },'RS': { center: [-31.57786119581683, -53.618896484375], zoom: 6 },'SC': { center: [-28.364017546608678, -51.065576171875], zoom: 7 },'SE': { center: [-10.760607953624762, -37.66724853515625], zoom: 8 },'SP': { center: [-24.736945920943844,-49.30263671875], zoom: 6 },'TO': { center: [-10.48227924591501, -48.306884765625], zoom: 6 }};

// Modelos de CSS
// Um para mostrar os partidos que estão ganhando em cada
// área do mapa mostrado (sejam estados, sejam municípios)
// E outro modelo para mostrar o desemepenho de um único(a)
// candidato(a) em cada área do mapa mostrado.
var modelo_css = {
    'vencedor': "#resultado_2014 {\
                        polygon-opacity: 0.5;\
                        line-color: #444;\
                        line-width: 0.1;\
                        line-opacity: 0.3;\
                      }\
                      #resultado_2014[partido='PBAN'] {\
                        polygon-fill: #A6CEE3;\
                      }\
                      #resultado_2014[partido='PBAR'] {\
                        polygon-fill: #1F78B4;\
                      }\
                      #resultado_2014[partido='PLAN'] {\
                        polygon-fill: #B2DF8A;\
                      }\
                      #resultado_2014[partido='PGAL'] {\
                        polygon-fill: #33A02C;\
                      }\
                      #resultado_2014[partido='PJAG'] {\
                        polygon-fill: #FB9A99;\
                      }\
                      #resultado_2014[partido='PARA'] {\
                        polygon-fill: #E31A1C;\
                      }\
                      #resultado_2014[partido='PKUW'] {\
                        polygon-fill: #FDBF6F;\
                      }\
                      #resultado_2014[partido='PT'] {\
                        polygon-fill: #dd3030;\
                      }\
                      #resultado_2014[partido='PSB'] {\
                        polygon-fill: #ffba34;\
                      }\
                      #resultado_2014[partido='PSDB'] {\
                        polygon-fill: #274fb3;\
                      }\
                      #resultado_2014[partido='PSC'] {\
                        polygon-fill: #438438;\
                      }\
                      #resultado_2014[partido='PSOL'] {\
                        polygon-fill: #ffc887;\
                      }\
                      #resultado_2014[partido='PMDB'] {\
                        polygon-fill: #9fde71;\
                      }\
                      #resultado_2014[partido='PSD'] {\
                        polygon-fill: #71afde;\
                      }\
                      #resultado_2014[partido='DEM'] {\
                        polygon-fill: #00c0ff;\
                      }\
                      #resultado_2014[partido='PSTU'] {\
                        polygon-fill: #f56bb9;\
                      }\
                      #resultado_2014[partido='PRTB'] {\
                        polygon-fill: #c6c063;\
                      }\
                      #resultado_2014[partido='PSDC'] {\
                        polygon-fill: #5155df;\
                      }\
                      #resultado_2014[partido='PDT'] {\
                        polygon-fill: #ff5569;\
                      }\
                      #resultado_2014[partido='PTdoB'] {\
                        polygon-fill: #77bc26;\
                      }\
                      #resultado_2014[partido='PR'] {\
                        polygon-fill: #484b73;\
                      }\
                      #resultado_2014[partido='PPL'] {\
                        polygon-fill: #194423;\
                      }\
                      #resultado_2014[partido='PCdoB'] {\
                        polygon-fill: #aa7800;\
                      }\
                      #resultado_2014[partido='PTC'] {\
                        polygon-fill: #0074aa;\
                      }\
                      #resultado_2014[partido='PROS'] {\
                        polygon-fill: #ff7200;\
                      }\
                      #resultado_2014[partido='PP'] {\
                        polygon-fill: #0c2470;\
                      }\
                      #resultado_2014[partido='PPS'] {\
                        polygon-fill: #974d36;\
                      }\
                      #resultado_2014[partido='PTB'] {\
                        polygon-fill: #202020;\
                      }\
                      #resultado_2014[partido='PTN'] {\
                        polygon-fill: #255b57;\
                      }\
                      #resultado_2014[partido='PRP'] {\
                        polygon-fill: #0adfcd;\
                      }\
                      #resultado_2014[partido='PSL'] {\
                        polygon-fill: #7ebaae;\
                      }\
                      #resultado_2014[partido='SDD'] {\
                        polygon-fill: #855a9e;\
                      }\
                      #resultado_2014[partido='PHS'] {\
                        polygon-fill: #d4ccb2;\
                      }",
    'desempenho': "#resultado_2014{\
                    polygon-fill: #FFFFB2;\
                    polygon-opacity: 0.8;\
                    line-color: #333;\
                    line-width: 0.2;\
                    line-opacity: 0.5;\
                  }\
                  #resultado_2014 [ valor_perc <= 76.05] {\
                     polygon-fill: #B10026;\
                  }\
                  #resultado_2014 [ valor_perc <= 29.4] {\
                     polygon-fill: #E31A1C;\
                  }\
                  #resultado_2014 [ valor_perc <= 24.21] {\
                     polygon-fill: #FC4E2A;\
                  }\
                  #resultado_2014 [ valor_perc <= 21.32] {\
                     polygon-fill: #FD8D3C;\
                  }\
                  #resultado_2014 [ valor_perc <= 19.15] {\
                     polygon-fill: #FEB24C;\
                  }\
                  #resultado_2014 [ valor_perc <= 16.51] {\
                     polygon-fill: #FED976;\
                  }\
                  #resultado_2014 [ valor_perc <= 11.82] {\
                     polygon-fill: #FFFFB2;\
                  }"
}


