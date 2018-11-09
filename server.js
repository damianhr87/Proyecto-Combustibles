//servidor acceso a api gobierno---------------
var express = require('express');
var app=express();
var url_naftacsv = 'http://datos.minem.gob.ar/dataset/1c181390-5045-475e-94dc-410429be4b17/resource/80ac25de-a44a-4445-9215-090cf55cfda5/download/precios-en-surtidor-resolucin-3142016.csv';
var request=require('request');
var csv = require('csvtojson');
var fs = require('fs');
var http = require('http');
var csvjson=require('csvjson');

var bodyParser=require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


//bajo archivo csv a disco ----------------
var request = http.get(url_naftacsv, function(response) {
    if (response.statusCode === 200) {
        var file = fs.createWriteStream("./csv/nafta.csv");
        response.pipe(file);
    }
    // Add timeout.
    request.setTimeout(12000, function () {
        request.abort();
    });
});
var options = {
  delimiter: ',',
  quote: '"'
};
// Escribir archivo en disco -----
var data_nafta = fs.readFileSync('./csv/nafta.csv', { encoding: 'utf8' });
console.log(data);
var json_result = csvjson.toObject(data_nafta, options);
var data = JSON.stringify(json_result);

//genero archivo de texto con forma pseudo.json ----------------
fs.writeFileSync('./json/nafta-json.in', data);

//este es archivo json en memoria no en disco -----------
var jsonData = JSON.parse(fs.readFileSync('./json/nafta-json.in', 'utf8'));

// for para filtrar por empresa ---------------------
var getEmpresas = (jsc) => {
    let empresas=[];
    for(let i=0; i<jsc.length;i++){
        if(empresas.indexOf(jsc[i]["empresa"]) == -1 ){
            empresas.push(jsc[i]["empresa"])
        }
    }
    return empresas;
}

// for para mostrar provincias -----------------
var getProvincias = (jsc) => {
    let provincias=[];
    for(let i=0; i<jsc.length;i++){
        if(provincias.indexOf(jsc[i]["provincia"]) == - 1){
            provincias.push(jsc[i]["provincia"])
        }
    }
    return provincias;
}
//for para mostrar Empresas ----------------
var getEmpresasPorId = (jsc) => {
    let idempresas=[];
    for(let i=0;i<jsc.length;i++){
        if(idempresas.indexOf(jsc[i]["idempresa"]) == -1 && jsc[i]["provincia"]=="CORDOBA"){
            idempresas.push(jsc[i]["idempresa"])
        }

    }
    return idempresas;
}

// for para mostrar ubicaciones ( return {empresa , direccion, latitud , longitud}-------
var getUbicacionEmpresas = (jsc) => {
    var ubicacionEmpresas=[];
    var idscordoba=getEmpresasPorId(jsc);
    var auxiliarArray=[];
    for(let i=0;i<jsc.length;i++){
        if(-1 !=idscordoba.indexOf(jsc[i]["idempresa"]) && -1 == auxiliarArray.indexOf(jsc[i]["empresa"])) {
            auxiliarArray.push(jsc[i]["empresa"]);
            let nombreEmpresa=(jsc[i]["empresa"]);
            let direccionEmpresa=(jsc[i]["direccion"]);
            let latitud=(jsc[i]["latitud"]);
            let longitud=(jsc[i]["longitud"]);
            let provincia=(jsc[i]["provincia"]);
            ubicacionEmpresas.push({empresa:nombreEmpresa,direccion:direccionEmpresa,latitud:latitud,longitud:longitud,provincia:provincia})
        }
    }
    return ubicacionEmpresas;
}


var getProductosPorEmpresa= (jsc) => {
  
    var empresas=getUbicacionEmpresas(jsc);
    var auxiliarArray=[];
    var auxiliarArray2=[];

    for(let i=0;i<jsc.length;i++) {

        let nombreEstacion=jsc[i]["empresa"];

        for(let j=i; j<jsc.length; j++) {
            
            if( ((jsc[i]['empresa'] == empresas[j]['empresa']) && (auxiliarArray.indexOf(jsc[j]["producto"])) == -1)) {
                auxiliarArray.push(jsc[j]["producto"]);
            }

            auxiliarArray2.push({empresa:nombreEstacion ,productos:auxiliarArray})
        }
    }

   return auxiliarArray2;     // {empresa:nombreEmpresa , productos : [] }
}

console.log(getProductosPorEmpresa(jsonData))

var getProductosPrecios = (jsc) => {
    let idscordoba=getEmpresasPorId(jsc);
    let productosPrecios=[];
    let auxiliarArray=[]
    for(let i=0;i<jsc.length;i++){
        if(-1 !=idscordoba.indexOf(jsc[i]["idempresa"])){
            let productoCombustible=(jsc[i]["producto"]);
            let precioNafta=(jsc[i]["precio"]);
            let nombreEmpresa=(jsc[i]["empresa"]);
            let infoEmpresa={producto:productoCombustible,precio:precioNafta,empresa:nombreEmpresa}
            productosPrecios.push({empresa:nombreEmpresa,info:infoEmpresa})

        }

    }
    return productosPrecios;
}
console.log(getProductosPrecios(jsonData))


// var getEmpresasDeCordoba = (jsc)=>{
//     let empresas=[];
//     for(let i=0; i<jsc.length;i++){
//         if(id=)
//     }

// }

// var getEstacionesPorProvincia = (jsc)=>{
//     let estaciones=[];
//     for (let i=0; i<jsc.length;i++){
//         if(jsc[i]["provincia"]) =="CORDOBA"{
//           {empresa:jsc[i]["empresa"],producto}  

//         }
//     }

// }




app.get('/', (req,res)=> console.log('algo'))
//app.post('/' ,(req,res)=> )
app.listen(3000 , (req,res)=> console.log("Puerto iniciado")) 
  





























