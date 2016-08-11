var publish      = require('../worker/worker');
var Model        = require('./config');
var fs           = require("fs");

var path = __dirname.substring(0, __dirname.length - 3) + '/public' + '/page.html';

Model.Url.remove(function (err, result) {
  if (err) {
    console.log('err is', err);
  } else {
    console.log('document dropped');
  }
});

module.exports = {
  worker: function (req, res) { 
    var searchTerm = req.body.message.trim();
    var query = {};
    searchTerm[0] === 'w' ? query.url = searchTerm : query._id = searchTerm;
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
        });
      }
    });
  }
};