module.exports = function(registry, seconds = 30) {
  function check(service) {
    return !!service;
  }

  function monitor() {
    Object.keys(registry).forEach(service => [].forEach.call(service, check));
  }

  setInterval(monitor, seconds * 1000);
};
