var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var util         = require('util');
var publish      = require('./worker/worker');
var Model        = require('./db/config');
var fs           = require("fs");

var path         = __dirname + '/public' + '/page.html';
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.post('/', function (req, res) { 
   var searchTerm = req.body.message;
   var query = {};
   searchTerm[0] === 'w' ? query.url = searchTerm : query._id = searchTerm;
   console.log('query from server', query, "at", Date.now());
   
   Model.Url.findOrCreate(query, function (err, page, created) {
    if (err) {
      console.log('err is', err);
      res.end();
    } else if (created && searchTerm[0] === 'w') {
        publish("", "jobs", new Buffer(searchTerm));
        res.send({url: page.url, jobId: page._id, status: 'pending'});
    } else {
        Model.Url.findOne(query, function (err, user) {
          if (err) {
            console.log('error is', err);
          } else if (page.html === undefined) {
            res.send({url: page.url, jobId: page._id, status: 'robots'});
          } else {
              fs.writeFile(path, page.html, function(error) {
                if (error) {
                 console.error("write error:  " + error.message);
                } else {
                    console.log("Successful Write to " + path);
                    res.send({url: page.url, jobId: page._id, status: 'complete'});
                }
              });
          }
        })
      }
  });
});

app.get('/drop', function (req, res) {
  Model.Url.remove(function (err, result) {
    if (err) {
      console.log('err is', err);
    } else {
      res.send('table dropped');
    }
  });
});

app.get('/page.html', function (req, res) {
  res.render('page.html');
})

app.listen(3000);







