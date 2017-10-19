let rx = require('rx');

function spliceRandom() {
  return this.splice(0 | (Math.random() * this.length), 1)[0];
}

class ConnectionPool {
  constructor(connections) {
    this.connections = connections;
    this.pool = [];
  }

  // TODO: implement some type of health logic instead of returning random connections
  get() {
    if (!this.connections.length) {
      throw new Error('ConnectionPool.get() called with no active connections');
    }

    if (!this.pool.length) {
      this.reset();
    }

    return this.pool::spliceRandom();
  }

  reset() {
    this.pool = this.connections.slice();
  }
}

module.exports = ConnectionPool;
