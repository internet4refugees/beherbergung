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

Login using credentials from DB_SEED. Hint: be careful with escaping ;-)

### debug

in case of failure you can add detail information by activating verbose-mode

```bash
SET VERBOSE=true
lein run
```

to check using test-data use

```bash
set DB_SEED="src/beherbergung/db/seed/test.edn"
lein run
```

### State management

Global state (e.g. instances of database and webserver) are managed by [mount](https://github.com/tolitius/mount).

# Installation

## Windows

The backend runs clojure. To install clojure you might use [leiningen](https://leiningen.org/).

### java install

But first check to have a java installtion ready to run.

```bash
java -version
```

If not - you can download it e.g. from [Adopt](https://adoptopenjdk.net/installation.html#x64_win-jdk). Dowload a LTS and HotSpot Version using the links and commands below "Windows x64 jdk installation". Basically it is just a Unziping and adding PATH to Environment.

### lein install

consider download, self-install and run via lein.bat

- locally
- or in a folder from your PATH-Variable (call SET in commandline to check)

```bash
curl https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein.bat >lein.bat
lein run
```

### errors

windows can't handle ":"-file names. Plz disable spit file in backend/src/beherbergung/db/export.clj by `(spit file)))` to `#_(spit file)))`. Or consider setting database by setting `DB_SEED`. Check your db-export-prefix setting for file system compatible pattern.

```bash
.\data\export\2022-03-18_10:03:37_start.edn (Die Syntax für den Dateinamen, Verzeichnisnamen oder die Datenträgerbezeichnung ist falsch)
```
