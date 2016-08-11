var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var controller   = require('./db/controller');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/', controller.worker); 

app.get('/page.html', function (req, res) {
  res.render('page.html');
})

app.listen(3000);







