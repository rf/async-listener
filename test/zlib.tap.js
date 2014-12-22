if (!process.addAsyncListener) require('../index.js');

var assert = require('assert');
var zlib = require('zlib');
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

test("test context preserve with zlib.gzip", function (t) {
  process.nextTick(function() {
    t.plan(1);
    process.addAsyncListener(listener);

    globalThing = "right";
    zlib.gzip(new Buffer("abcd"), function (err, data) {
      console.log("globalThing is " + globalThing);
      t.assert(globalThing === "right");
      t.end();
    });
    globalThing = "wrong";

    process.removeAsyncListener(listener);
  });
});

test("test context preserve with zlib.unzip", function (t) {
  process.nextTick(function() {
    t.plan(1);
    process.addAsyncListener(listener);

    globalThing = "right";
    zlib.unzip(new Buffer("abcd"), function (err, data) {
      console.log("globalThing is " + globalThing);
      t.assert(globalThing === "right");
      t.end();
    });
    globalThing = "wrong";

    process.removeAsyncListener(listener);
  });
});
