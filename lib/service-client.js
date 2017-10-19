let extend = require('lib/extend');
let retry = require('promise-repeat');
let ConnectionPool = require('./connection-pool');
let ServiceResolver = require('./service-resolver');

class ServiceClient {
  constructor(service, config = {}) {
    this.service = service;

    this.payloadRetryOptions = extend({}, config.payloadRetryOptions || {}, {
      maxTimeout: 3 * 1000,
      maxAttempts: 3,
    });

    let resolveRetryOptions = extend({}, config.resolveRetryOptions || {}, {
      maxTimeout: 60 * 1000,
      maxAttempts: Infinity,

      // double retry interval fro 100ms-->5 sec
      debounceFn: retries => Math.min(5000, 2 ** retries * 50),
    });

    this.resolvePromise = resolveService(service, resolveRetryOptions);
  }

  then(fn) {
    this.resolvePromise.then(fn);
  }
  catch(fn) {
    this.resolvePromise.catch(fn);
  }

  send(payload) {
    return this.resolvePromise.then(connectionPool => {
      let pool = new ConnectionPool(connectionPool);

      return new Promise((resolve, reject) => {
        getRandomConnection().then();
        let completed = false;

        setTimeout(() => {
          reject(`Service ${this.service} timed out`);
          completed = true;
        }, this.maxTimeout);

        resolveService(this.service, this.payloadRetryOptions)
          .then(sendPayload.bind(null, payload))
          .then(resolve)
          .catch(reject);
      });
    });
  }
}

module.exports = ServiceClient;
