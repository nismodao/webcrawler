var express      = require ( 'express' );
var app          = express();
var bodyParser   = require ('body-parser');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var pub = new EventEmitter();
// var Message = function () {
//   this.store = {};
// }

// util.inherits(Message, EventEmitter);

// Message.prototype.send = function (value) {
//   this.emit('message', value);
// }

// var message = new Message();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.post('/', function (req, res) {
  var message = req.body.message;
  pub.emit('url', message);
  res.end();
});

module.exports = pub;
app.listen(3000);