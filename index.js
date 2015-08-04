'use strict';
var http = require('http');
var serveStatic = require('serve-static');
var serve = serveStatic('public');
var minimist = require('minimist');
var request = require('request');
var qs = require('querystring');
var moment = require('moment');

var argv = minimist(process.argv);
var endpointUrl = 'http://earthquake.usgs.gov/fdsnws/event/1/query';
var reqQuerystring;
var ISO_FORMAT = 'YYYY-MM-DD';

var requestHandler = function(req, res) {
  if (req.url.indexOf('/data') !== -1) {
    // parsear querystring de req.url utilizando el módulo qs
      // la querystring comienza luego del '?' de la URL

    
    // utilizar el módulo request para hacer una solicitud GET a
    // endpointUrl con un querystring con los valores
    // {format: 'geojson', starttime: 'el valor de starttime en req.url', endtime: 'el valor de endtime en req.url'}
      // si la solicitud respondió ok, escribir el status code 200 en req y agregar el header de Content-Type
      // en 'application/json'
      // luego terminar req con el resultado de invocar mapToObjects(aggregate(body)) dónde body es la respuesta
      // de la solicitud realizada
    //si hubo un error, responder con un status code 400 y terminar req sin datos
    return;
  }

  // parte dónde sirvo contenido estático
  serve(req, res, function() {
    res.end();
  });
}

var server = http.createServer(requestHandler);

var port = argv.port || process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8000;
var ip = argv.ip || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.listen(port, ip, function() {
  console.log('Server is now listening at port: ' + port);
});

function aggregate(arr) {
  var resultado = {};

  arr.features.forEach(function(elem) {
    var pais = elem.properties.place.split(',')[1];

    if (resultado[pais]) {
      resultado[pais]++;
    } else {
      resultado[pais] = 1;
    }
  });
  return resultado;
}

function mapToObjects(obj) {
  var resultado = [];
  var keys = Object.keys(obj);

  keys.forEach(function(key) {
    resultado.push({ name: key, value: obj[key]});
  });
  return resultado;
}