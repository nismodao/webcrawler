var express      = require ('express');
var app          = express();
var bodyParser   = require ('body-parser');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var publish      = require('./worker/worker');
var Model        = require('./db/config');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.post('/', function (req, res) { 
   var url = req.body.message;
   Model.Url.findOrCreate({url: url}, function (err, page, created) {
    if (err) {
      console.log('err is', err);
      res.end();
    } else if (created) {
        publish("", "jobs", new Buffer(url));
        res.send('job sent to queu for processing');
    } else {
        Model.Url.findOne({url: url}, function (err, user) {
          if (page.html === undefined) {
            res.send('robots are fetching this page');
          } else {
            res.send(page.html);
          }
        })
    }
  });
});

app.listen(3000);