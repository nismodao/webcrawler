// var Model     = require('./config');
// var pubsub    = require('../publish/event');


// module.exports = {
//   checkURL: function (req, res) {
//   var url = req.body.message;
//   Model.Url.findOne({url: url})
//     .then(function (result) {
//       pubsub.send(url);
//       console.log('result from controller', result);
//       res.send(result);
//       })
//     .catch(function (err) {
//       res.send('error in accessing Db');
//     })
//   },
//   pubsub: pubsub
// }
