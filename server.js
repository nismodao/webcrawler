var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var controller   = require('./db/controller');
var cluster      = require('cluster');


if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {  
    console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
      cluster.fork();
  });
} else {
  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.post('/update', controller.worker); 

  app.get('/page.html', function (req, res) {
    res.render('page.html');
  })
  app.listen(3000);

} 









