let ServiceClient = require( './service-client' );

module.exports = {
  require : function( serviceName ){
    return new ServiceClient( serviceName );
  }
};
