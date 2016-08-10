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
        res.json({url: url, jobId: page._id, status: 'pending'});
    } else {
        Model.Url.findOne({url: url}, function (err, user) {
          if (page.html === undefined) {
            res.send({url: url, jobId: page._id, status: 'robots are working on it'});
          } else {
            res.send({url: url, jobId: page._id, status: 'complete', html: page.html});
          }
        })
    }
  });
});

app.listen(3000);