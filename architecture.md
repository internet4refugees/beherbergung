## Overview

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

## Import Pipeline

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
