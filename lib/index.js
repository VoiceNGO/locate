// Configure require.paths to load local copies of owned modules instead of npm installed versions
process.env.NODE_MODULES && require('app-module-path').addPath(process.env.NODE_MODULES);

module.exports = {
  client: require('./lib/client'),
  server: require('./lib/server'),
  provider: require('./lib/provider'),
};
