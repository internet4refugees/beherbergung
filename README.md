This repository contains tools for NGOs, organizing private hosting.

## Import of existing datasets

- [x] https://mission-lifeline.de/unterkunft-bereitstellen/
- [x] https://warhelp.eu/
- [x] https://www.dhdd.info/
- [x] https://icanhelp.host/ (public API)

## Transformation / Merging / Export

- [x] edn
- [x] json
- [x] csv
- [x] xlsx

## A secure / robust / scalable **backend**, usable by all NGOs

Every NGO can decide between self-hosting the backend or using a backend provided by us.

- [ ] nixos server deployment
- [x] reproducible builds with nixpkgs
- [x] xtdb
- [x] graphql

Reuses the technology stack of [swlkup](https://github.com/johannesloetzsch/swlkup)

## A frontend for authorized NGO members, to **search** the database

A website written for this use case allows easy input of filters. The usage of finding matches will be much more convenient than working with a spreadsheet.

- [ ] **Should be available this week** (work in progress)

## A customizable public form, to submit new offers

There is no need to use this component for NGOs happy with their existing solution. Instead they can use the [import function or an API adapter](#import-of-existing-datasets).

An optional new form was requested by:

- [ ] zentralwerk & goethe institut
- [ ] lifeline
