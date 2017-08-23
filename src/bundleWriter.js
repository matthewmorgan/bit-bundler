"use strict";

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var types = require("dis-isa");
var loggerFactory = require("./logger");
var logger = loggerFactory.create("bundler/build");

function bundleWriter() {
  return function writerDelegate(context) {
    var pending = [];

    context.visitBundles((bundle) => {
      if (bundle.content && bundle.dest) {
        pending.push(writeBundle(logger, bundle));
      }
    });

    return Promise.all(pending).then(() => context);
  };
}

function writeBundle(logger, bundle) {
  return new Promise((resolve, reject) => {
    streamFactory(bundle.dest).write(bundle.content, (err) => {
      if (err) {
        logger.error("write-failure", bundle, err);
        reject(err);
      }
      else {
        logger.log("write-success", bundle);
        resolve();
      }
    });
  });
}

function fileStream(dest) {
  mkdirp.sync(path.dirname(dest));
  return fs.createWriteStream(dest);
}

function streamFactory(dest) {
  if (types.isFunction(dest)) {
    dest = dest();
  }

  return types.isString(dest) ? fileStream(dest) : dest;
}

bundleWriter.stream = streamFactory;
module.exports = bundleWriter;
