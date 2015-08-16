# Locate

A micro-service discovery system.  Automatically handles monitoring, load-balancing.  Runs on DNS
`locate`, which should resolve to <REGION>.i.s.<DOMAIN>, which should resolve to 1-N public facing
servers.

## Region Levels

1. server
2. rack               // Not implemented
3. data-center
4. region (same host)
5. city               // Not implemented
6. state              // Not implemented
7. country            // Not implemented
8. continent          // Not implemented
9. world

## Server

Provides end-points:

```
POST /{name}
{
    "ip"              : 0.0.0.0
  , "port"            : 0
  , "region"          : "region" // default = auto-detect
  , "monitor_endpoint": "/uri"   // default = /monitor
  , "monitor_port"    : 0        // default = port
}

DELETE /{name}
{
    "ip"     : 0.0.0.0
  , "port"   : 0
}

GET /{name}?proximity=[1..10]
[{
    "ip"  : 0.0.0.0
  , "port": 0
}]
```

## Provider

Provides API calls:

```
Provider(service_name)
  .provide(function || Promise(function))
  .monitor(function || Promise(function))
```

## Client

Provides API calls:

```
.require( service_name )
  ( payload )
    .then()
```

## Service Spec

Protocol Buffer Spec

```protobuf
message Service {
  required string name = 1;

}  
```
