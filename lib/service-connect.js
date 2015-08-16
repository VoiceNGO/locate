// responsible for keeping a pool of connections to a given service
// Singletons
let pool = {};
class ServiceConnect {
  constructor( service ){
    // Only allow one instance per service
    if( pool[ service ] ){ return pool[ service ]; }

    this.service = service;
  }

  getOne( cb ){
    return new Promise( ( resolve, reject ) => {

    } )
    .then( cb );
  }

  getAll( cb ){

  }
}

module.exports = ServiceConnect;
