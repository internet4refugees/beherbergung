# „beherbergung“ server

The core of the server is an graphql-api based on [specialist](https://github.com/ajk/specialist-server).

As database the [datalog](https://en.wikipedia.org/wiki/Datalog) implementation [XTDB](https://xtdb.com/) is used with a [RocksDB](https://rocksdb.org/) data store. Some help how to access the database for development/debug purposes can be found in [./DB.md](./DB.md)

## Running development server

To start the server and send queries, run:

```bash
lein run

curl -H 'Content-type: application/json' -d '{"query":"{ TODO }"}' http://localhost:4000/graphql
```

## Testing

```bash
lein test
```

## Production build

```bash
lein ring uberjar

java -jar target/beherbergung-*standalone.jar
```

### Reproducible builds

Whenever dependencies are changed, rebuild the mvn2nix-lock.json:

```bash
nix run ..#backendUpdatedDeps
```

This allows to build by:

```bash
nix build ..#backend
```

## Configuration

Configuration management is done with [yogthos](https://github.com/yogthos/config).
Default values are set at `src/config.edn`, there you see the available options.
In `.lein-env.example` you find the variables you should set yourself.
To set config options at runtime, use `environment variables`, `java system properties` or an .edn file specified using the `config` environment variable.

## Notes to developers

### State management

Global state (e.g. instances of database and webserver) are managed by [mount](https://github.com/tolitius/mount).
