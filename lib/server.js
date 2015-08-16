let http = require( 'http' );
let url  = require( 'url' );

let registry = {};

require( './monitor' )( registry );

function getPostData( req ){
  return new Promise( function( resolve ){
    let body = '';

    req.on( 'data', (data) => body += data );
    req.on( 'end', () => resolve( JSON.parse( body ) ) );
  } );
}

http.createServer( function( request, response ){
  let uri       = url.parse( request.url );
  let query     = uri.query;
  let service   = uri.path.substr( 1 );
  let proximity = query.proximity || 3;
  let ip        = '';
  let region    = '';
  let push      = [].push;
  let regionRx  = /^[a-z]+/i;
  let register  = registry[service] || ( registry[service] = [] );

  let regionFilters = {
      // 1 - Server
      // 2 - Rack
      // 3 - Data-Center
      // 4 - Region
      // 5 - City
      // 6 - State
      // 7 - Country
      // 8 - Continent
      // 9 - World

      '1' : ( service ) => ip === service.ip
    , '2' : () => regionFilters[1].apply( this, arguments )
    , '3' : ( service ) => regionRx.exec( service.region )[0] === regionRx.exec( region )[0]
    , '4' : ( service ) => region === service.region
    , '5' : () => regionFilters[4].apply( this, arguments )
    , '6' : () => regionFilters[4].apply( this, arguments )
    , '7' : () => regionFilters[4].apply( this, arguments )
    , '8' : () => regionFilters[9].apply( this, arguments )
    , '9' : () => true
  };

  let responseHandlers = {
      get    : ()      => register.filter( regionFilters[ proximity ] )
    , post   : ( req ) => getPostData( req ).then( register::push )
    , delete : ( req ) => getPostData( req )
      .then( ( data ) => registry[service] = register.filter(
        ( service ) => !( (!data.ip || (data.ip === service.ip)) && (!data.port || (data.port === service.port)) )
      ) )
  };

  let responseData = responseHandlers[ request.method ]( request, response );
  let json         = JSON.stringify( responseData );

  response.end( json );
}).listen( 8000 );
