## Overview

as discribed the projects bases of backend and separated frontend. The file system structure represents this.

```mermaid
flowchart LR;
    classDef focus fill:#f96;
    classDef hide_ color:gray , stroke-dasharray: 5 5 , stroke:lightgray;

    p(project) --> b(backend)
    p --> f(frontend)
    f --> se(search)
    f --> su(submit)
    
```

Whilst the backend runs on clojure the frontend is modeled in nodejs quering data unsing graphql-interface. 

```mermaid
flowchart LR;
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
    backend ==graphql==> frontend
    style clojure color:grey;
    style nodejs color:grey;
    linkStyle 0 stroke:lightgrey;
    linkStyle 1 stroke:lightgrey;
```
The import and export function currently tied to the backend. Data to import will be pipelined from the source to interal database (rocksdb). Multiple steps allow imports to be adjusted. The connector gathers data from source (APIs, crawling for HTML/Mail) or supplied files. 

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

Delivered formats are loaded into objects. In general we expect 2 dimensional data. 
**First step - Reading** A file contains multiple rows. Each row is a data point. Each row has multiple values. Imports as CSV support headlines. 
**Second step - Mapping** The internal 2-dimensional data grid is mapped with help of associative attribut naming. Further rules, checks and specialised functions are added - see 'offer_mapping'. This allows to handle customer specific representation of boolean values or time string formats.

Graphql allows a generic way to access the database. This way only mappers have to deal with the specific customer related data model. To allow merging or exchanging of differnt modeled data a further mapping will be applied. The,so called, key mapping generates a key/fingerprint to match data only key-attribut-tupels accross different data models by hash value. 
