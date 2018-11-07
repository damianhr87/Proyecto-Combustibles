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
var data_nafta = fs.readFileSync('./csv/nafta.csv', { encoding: 'utf8' });
console.log(data);
var json_result = csvjson.toObject(data_nafta, options);
var data = JSON.stringify(json_result);
fs.writeFileSync('./json/nafta-json.in', data);

var jsonData = JSON.parse(fs.readFileSync('./json/nafta-json.in', 'utf8'));





app.get('/', (req,res)=> console.log('algo'))
//app.post('/' ,(req,res)=> )
app.listen(3000 , (req,res)=> console.log("Puerto iniciado"))	
	





























