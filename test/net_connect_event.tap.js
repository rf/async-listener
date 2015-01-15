if (!process.addAsyncListener) require('../index.js');

var assert = require('assert');
var net = require('net');
var test = require('tap').test;

var globalThing;

var callbacks = {
  create: function onAsync() {
    return globalThing;
  },

  before: function (context, storage) {
    globalThing = storage;
  },

  after: function () {
    globalThing = null;
  },

  error: function () {
    globalThing = null;
  }
};

var listener = process.createAsyncListener(callbacks);

test("test context preserve in Socket 'connect' event", function (t) {
  process.nextTick(function() {
    t.plan(1);
    process.addAsyncListener(listener);

    globalThing = "right";

    var socket = net.createConnection(80, "www.google.com", function () {
      console.log("connect listener1 . globalThing: " + globalThing);
    });

    socket.on('connect', function () {
      console.log("connect listener. globalThing: " + globalThing);
      t.assert(globalThing === "right");
      t.end();
      socket.end();
    });

    globalThing = "wrong";

    process.removeAsyncListener(listener);
  });
});

