This repository contains tools for NGOs, organizing private hosting.

![](./docs/user-guide/graphics/overview.png)

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

Implemented by reusing the technology stack of [swlkup](https://github.com/johannesloetzsch/swlkup)

## A frontend for authorized NGO members, to **search** the database

A website [based on reactdatagrid](https://reactdatagrid.io/) allows easy filtering and sorting of results. The usage of finding matches is much more convenient than working with a regular spreadsheet. Collaboration features will be available soon.

- [x] Alpha version is online
- [x] Editable columns
- [x] Map view / Location filter+sorting

A [user manual](./docs/user-guide/user-guide-en.md) is available in [English](./docs/user-guide/user-guide-en.md) and [German](./docs/user-guide/user-guide-de.md).

## A customizable public form, to submit new offers

There is no need to use this component for NGOs happy with their existing solution. Instead they can use the [import function or an API adapter](#import-of-existing-datasets).

An optional new form was requested by:

- [ ] zentralwerk & goethe institut
- [ ] lifeline

## Contributing

See this [file][development.md] for developer facing documentation.
