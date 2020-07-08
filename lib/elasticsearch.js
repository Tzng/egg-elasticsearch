'use strict';

const assert = require('assert');
const elasticsearch = require('@elastic/elasticsearch');

module.exports = app => {
  const config = app.config.elasticsearch;
  assert(config.node || config.nodes, '[egg-elasticsearch] \'host\' or \'hosts\' is required on config');

  app.coreLogger.info('[egg-elasticsearch] connecting elasticsearch server');

  const client = new elasticsearch.Client(config);

  Object.defineProperty(app, 'elasticsearch', {
    value: client,
    writable: false,
    configurable: false,
  });

  app.beforeStart(function() {
    client.ping({
      requestTimeout: 30000,
    }, function(error) {
      if (error) {
        app.coreLogger.error('[egg-elasticsearch] elasticsearch cluster is down with error: ' + error);
      } else {
        app.coreLogger.info('[egg-elasticsearch] elasticsearch connects successfully');
      }
    });
  });
};
