## Overview

As described, the project is based on a backend and a separate frontend. The structure of the file system represents this.

```mermaid
flowchart LR;
    classDef focus fill:#f96;
    classDef hide_ color:gray , stroke-dasharray: 5 5 , stroke:lightgray;

    p(project) --> b(backend)
    p --> f(frontend)
    f --> se(search)
    f --> su(submit)

```

While the backend runs on Clojure, the frontend is built with React and queries data via the Graphql interface.

```mermaid
flowchart RL;
    classDef focus fill:#f96;
    classDef hide_ color:gray , stroke-dasharray: 5 5 , stroke:lightgray;
     subgraph backend
        subgraph clojure
            direction TB
            I(import):::hide_ -.- B(backend):::focus
            B -.- e(export):::hide_
        end
    end
    subgraph frontend
        subgraph nodejs
            direction LR
            D(search):::focus
            E(submit):::hide_
        end
    end
    frontend ==graphql==> backend
    style clojure color:grey;
    style nodejs color:grey;
    linkStyle 0 stroke:lightgrey;
    linkStyle 1 stroke:lightgrey;
```

## Import pipeline

The import and export function is currently tied to the backend. Data to be
imported is piped from the source to the internal database (rocksdb). Through
several steps, imports can be customized. The connector collects data from the
source (APIs, crawling for HTML/E-Mail) or from supplied files.

```mermaid
flowchart LR;
    classDef focus fill:#f96;
    subgraph connector
        direction LR
        c_a(REST-api) --> d
        c_c(HTML crawler)--> d
        c_m(mail crawler) --> d(data):::focus
    end
    subgraph import
        direction LR
        c(csv) --> o(object):::focus
        e(edn) --> o
        j(json) --> o
        xlm(xlm) --> o
        xlsx(xlsx) --> o
        o --> I(mapping):::focus
    end
    subgraph backend
         db[(db)]:::focus
    end
        c_f(file) --> import
    connector --> import
    import --> backend
```

**1st step - Extracting** Delivered formats are loaded into objects. In general we expect 2 dimensional data - the data set.

**2nd step - Loading** A dataset contains multiple tupel. A tupel in turn consists of multiple attributes. Imports may support separate headlines. In case of csv the first row could be a headline. Usually each csv-row is a tupel/data point.

**3rd step - Mapping** The internal 2-dimensional data grid is mapped with help of associative attribut naming. Further rules, checks and specialised functions are added - see 'offer_mapping'. This allows to handle customer specific representation of boolean values or time string formats.

Graphql allows generic access to the database. This way only the mappers have to
deal with the specific customer related data model. To enable the merging or
exchange of different data models, another mapping is applied. The so-called key
mapping generates a key/fingerprint to match data containing only key-attribute
tuples across different data models by a hash value.
