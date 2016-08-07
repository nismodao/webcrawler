var express      = require ( 'express' );
var app          = express();
var bodyParser   = require ('body-parser');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.post('/', function (req, res) {
  var message = req.body.message;
  console.log(message);
  res.end();
});

app.listen(3000);