
$.ajax({
    type: 'GET',
    url:  url,
    headers: {
        'X-API-Key' : 'iRrzoK6PUry9a4YWJsVQTPVGVm7Uwj1J8Eylp6O0'
    }
}).done(function(datos) { 
    switch (vista) {
        case "sd":
            listarMiembros(datos, camaraTabla);
            break;
        case "hd":
            listarMiembros(datos, camaraTabla);
            break;
        case "sa":
            listarNumero(datos);
            listarPerdidos(datos, camaraTabla2, bottom);
            listarPerdidos(datos, camaraTabla3, top);
            break;
        case "ha":
            listarNumero(datos);
            listarPerdidos(datos, camaraTabla2, bottom);
            listarPerdidos(datos, camaraTabla3, top);
            break;
        case "sp":
            listarNumero(datos);
            listarPerdidos(datos, camaraTabla3, bottom);
            listarPerdidos(datos, camaraTabla2, top);
            break;
        case "hp":
            listarNumero(datos);
            listarPerdidos(datos, camaraTabla3, bottom);
            listarPerdidos(datos, camaraTabla2, top);
            break;
    };
});

var bottom = "bottom";
var top = "top";
var numeroDemocratas = [];
var numeroRepublicanos = [];
var numeroIndependientes = [];
var votosPartidoD = 0;
var votosPartidoR = 0;
var votosPartidoI = 0;
var votosPerdidos = 0;
var votosPerdidosPct = 0;

var estadisticas = {
    "numDemocratas" : "0",
    "numRepublicanos" : "0",
    "numIndependientes" : "0",
    "votosPartidoInd" : "0",
    "votosPartidoRep" : "0",
    "votosPartidoDem" : "0",
    "miembroMenos" : []
};

function listarMiembros(data, camara){

    var miembros = data.results[0].members.slice();

            for (let i = 0; i < miembros.length; i++) {  

                let miembro = miembros[i];
                let url = miembro["url"];
                let textoCelda = "";
                let nombre = [ miembro["first_name"] , miembro["middle_name"] , miembro["last_name"] ];
                let sinNull = [ nombre.filter(Boolean)];
                let x = sinNull.join(' ');

                document.getElementById(camara).insertAdjacentHTML( "afterend" ,
                    "<tr><td><a href='" + url + "'>"+ x +
                    "</a></td><td>" + miembro["state"] +
                    "</td><td>" + miembro["party"] +
                    "</td><td>" + miembro["seniority"] +
                    "</td><td>" +  miembro["votes_with_party_pct"] + " %" +
                    "</td></tr>" );
            };
};

function listarPerdidos(data, camara, asistencia){

    let miembros = data.results[0].members.slice();

    if(camara == "senate-loyalty2" || camara == "house-loyalty2" || 
       camara == "senate-loyalty3" || camara == "house-loyalty3"){
        var y = "votes_with_party_pct";
        var z = "total_votes";
    }else{
        var y = "missed_votes_pct";
        var z = "missed_votes";
    };

    if(asistencia == "bottom"){
        miembros.sort((a,b)=>{return  b[y] - a[y]});
    }else{
        miembros.sort((a,b)=>{return  a[y] - b[y]});
    };

    let largo = (miembros.length *0.1).toFixed(0);

    for (let i = 0; i < largo; i++) {

        let nombre = [ miembros[i]["first_name"] , miembros[i]["middle_name"] , miembros[i]["last_name"] ];
        let sinNull = [ nombre.filter(Boolean)];
        let x = sinNull.join(' ');

        estadisticas.miembroMenos.nombre = JSON.stringify(x);
        estadisticas.miembroMenos.perdidos = JSON.stringify(miembros[i][z]);
        estadisticas.miembroMenos.porcentaje = JSON.stringify(miembros[i][y]);
        //funcion insertAdjacentHTML
        document.getElementById(camara).insertAdjacentHTML("afterend" ,
            "<tr><td>" + estadisticas.miembroMenos.nombre +
            "</td><td>" + estadisticas.miembroMenos.perdidos +
            "</td><td>" + estadisticas.miembroMenos.porcentaje + " % </td></tr>");

            // document.getElementById("senate-attendance2").innerHTML = document.getElementById("senate-attendance2").innerHTML +
            // "<tr><td>"+ estadisticas.miembroMenos.nombre +"</td><td>"+ estadisticas.miembroMenos.perdidos +"</td><td>"+ estadisticas.miembroMenos.porcentaje +"</td></tr>"
    };
};

//calcula cantidad de representantes y promedio de votos por partido
function listarNumero(data){
    let miembros = data.results[0].members.slice();
    let aux = 0;
    let aux1 = 0;
    let aux2 = 0;
    for (let i = 0; i < miembros.length; i++) {
        if (miembros[i].party == "R") {
            numeroRepublicanos.push(miembros[i].votes_with_party_pct);
            votosPartidoR = (aux += miembros[i].votes_with_party_pct) / numeroRepublicanos.length;
        };
        if (miembros[i].party == "D") {
            numeroDemocratas.push(miembros[i].votes_with_party_pct);
            votosPartidoD = (aux1 += miembros[i].votes_with_party_pct) / numeroDemocratas.length;     
        };
        if (miembros[i].party == "I") {
            numeroIndependientes.push(miembros[i].votes_with_party_pct);
            votosPartidoI = (aux2 += miembros[i].votes_with_party_pct) / numeroIndependientes.length;       
        };
    };
    estadisticas.numRepublicanos = JSON.stringify( numeroRepublicanos.length );
    estadisticas.numDemocratas = JSON.stringify(numeroDemocratas.length);
    estadisticas.numIndependientes = JSON.stringify(numeroIndependientes.length);
    estadisticas.votosPartidoRep = JSON.stringify(votosPartidoR.toFixed(2));
    estadisticas.votosPartidoDem = JSON.stringify(votosPartidoD.toFixed(2));
    estadisticas.votosPartidoInd = JSON.stringify(votosPartidoI.toFixed(2));

    document.getElementById("rNumer").innerHTML = estadisticas.numRepublicanos;
    document.getElementById("rVotos").innerHTML = estadisticas.votosPartidoRep + " %";
    document.getElementById("dNumer").innerHTML = estadisticas.numDemocratas; 
    document.getElementById("dVotos").innerHTML = estadisticas.votosPartidoDem + " %";
    document.getElementById("iNumer").innerHTML = estadisticas.numIndependientes;
    document.getElementById("iVotos").innerHTML = estadisticas.votosPartidoInd + " %";
};
