This repository contains tools for NGOs organizing private hosting.

![](./docs/user-guide/graphics/overview-without-clustering.png)

## Import / Transformation / Merging / Export of existing datasets

- [x] https://mission-lifeline.de/unterkunft-bereitstellen
- [x] https://warhelp.eu
- [x] https://icanhelp.host
- [x] other Datasets created from Wordpress-Forms or Google-Docs
- [x] Tables in one of this file formats: xlsx, csv, json, edn, xml

If you need help using our software with your data, please contact us…

## A secure / robust / scalable **backend**, usable by all NGOs

Each NGO can choose to host the backend themselves or use a backend provided by us.

Implemented by reusing the technology stack from [swlkup](https://github.com/johannesloetzsch/swlkup).

## A frontend for authorized NGO members, to **search** the database

A website [based on reactdatagrid](https://reactdatagrid.io/) allows easy filtering and sorting of results. Using search for matches is much more convenient than working with a regular spreadsheet.

- [x] Beta version is online
- [x] Filtering + Sorting by any column
- [x] Editable columns (realtime collaboration)
- [x] Map view and search by distance

A [user guide](./docs/user-guide/user-guide-en.md) is available in [English](./docs/user-guide/user-guide-en.md) and [German](./docs/user-guide/user-guide-de.md).

## A customizable public form, to submit new offers

NGOs that are satisfied with their existing solution do not need to use this component. Instead, they can use the [import function or an API adapter](#import--transformation--merging--export-of-existing-datasets).

- [ ] An optional new form should be available soon.

# Contributing

Read the [documentation intended for developers](./docs/DEVELOPMENT.md) and the [architecture](./docs/ARCHITECTURE.md) documentation.
There is also a README.md for each component in its directory.

# Similar projects

- [Refugeesrouter](https://github.com/Lassulus/refugeerouter) - Match refugees groups, flats and drivers
