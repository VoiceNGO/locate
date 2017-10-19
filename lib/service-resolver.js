let retry = require('promise-repeat');
let extend = require('extend');
let request = require('request-promise');
let host = require('detect-hosting-provider');

function pick(object, keys) {
  let out = {};

  for (let key of keys) {
    if (object.hasOwnProperty(key)) {
      out[key] = object[key];
    }
  }

  return out;
}

// Promise resolves with a pool of services
class ServiceResolver {
  /**
   * Resolves and connects to the local locate server.
   *
   * One of [serverURI|domain] is required in order to resolve the server.
   *
   * @param {Object}  options                 Config options
   * @param {String}  [serverURI=auto-detect] URI of the locate server.  Include any key provided
   *                                          from the `detect-hosting-provider` module if desired,
   *                                          e.g. you can use `${region}` or `${ipv4}` as desired.
   *                                          Defaults to
   *                                          `{https}://{region}.{domain}:{port}/{service}`
   * @param {String}  [domain]                domain, e.g. `mydomain.com`.  The locate server is
   *                                          assumed to be at {region}.{domain} if this option is
   *                                          used.
   * @param {Boolean} [https=false]           Use https or not?
   * @param {Number}  [port=80]               service port
   * @param {Object}  retryOptions            Options to pass through to the promise-repeat module
   *                                          for the initial connection
   */
  constructor(service, options) {
    if (!options.serverURI && !options.domain) {
      throw new Error('ServiceResolver requires one of the following options: serverURI, domain');
    }

    this.service = service;
    this.options = extend({}, pick(options, retry.validOptions), {
      pollInterval: 30 * 1000,
    });
    this.connections = [];

    let serverURI = options.serverURI || `\${region}.${options.domain}`;
    let https = `http${options.https ? 's' : ''}`;
    let port = options.port || 80;

    // replace the string literal ${region} in the URI
    // TODO: replace all other params
    serverURI = serverURI.replace(/\$\{region\}/g, host.region);

    this.serverURI = `${https}://${serverURI}:${port}/${service}`;

    return retry(::this.poll, pick(options.retryOptions, retry.validOptions));
  }

  poll() {
    request(this.serverURI).then(data => {
      this.connections.length = 0;
      this.connections.push(JSON.parse(data));
    });
  }
}

module.exports = ServiceResolver;
