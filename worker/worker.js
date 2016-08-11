require('dotenv').config();
var schedule      = require('node-schedule');
var amqp          = require('amqplib/callback_api');
var request       = require('request');
var Model         = require('../db/config');

var amqpConn = null;
var consumerTag = null;
var pubChannel = null;
var consumerChannel = null;
var offlinePubQueue = [];

function start() {
  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}

function whenConnected() {
  startPublisher();
  startWorker();
}

function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return;
      ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    pubChannel = ch;
    while (true) {
      var m = offlinePubQueue.shift();
      if (!m) break;
      publish(m[0], m[1], m[2]);
    }
  });
}

function publish(exchange, routingKey, content) {
  try {    
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
    function(err, ok) {
      if (err) {
        console.error("[AMQP] publish", err);
        offlinePubQueue.push([exchange, routingKey, content]);
        pubChannel.connection.close();
      }
    });
  } catch (e) {                                                                                                                               
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}
// A worker that acks messages only if processed succesfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    consumerChannel = ch;
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });

    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });
    
    ch.prefetch(10);
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false }, function (err, ok) {
      consumerTag = ok.consumerTag;
      console.log('consumerTag from createChannel', consumerTag);
      console.log("Worker is started");
      });
    });
    
    function processMsg(msg) {
      work(msg, function(ok) {
        try {
          if (ok)
            ch.ack(msg);
          else
            ch.reject(msg, true);
        } catch (e) {
          closeOnErr(e);
        }
      });
    }  
  });
}

function cancelWorker (consumerTag) {
  consumerChannel.cancel(consumerTag, function (err, ok) {
    if (err) {
      console.log(err); 
    } else {
      console.log('cancel function called', ok);
    }
  });
}

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

function work(msg, cb) {
  console.log("Got msg ", msg.content.toString());
  var url = msg.content.toString();
  console.log('work message', "http://" + url);
  request("http://" + url, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      Model.Url.findOneAndUpdate({url: url}, {html: body}, {new: true}, function (err, doc) {
        if (err) return console.log(err);
        console.log('model updated');
      })
    }
  })
  cb(true);
}

start();

// var listen = schedule.scheduleJob('* * * * *', function(){
//   console.log('schedule worker is on');
//   startWorker();
// });

// var stop = schedule.scheduleJob('*/2 * * * *', function(){
//   console.log('kill worker called');
//   cancelWorker(consumerTag);
// });

module.exports = publish;