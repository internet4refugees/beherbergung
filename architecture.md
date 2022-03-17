This repository contains tools for NGOs, organizing private hosting.

## Import of existing datasets

- [x] https://mission-lifeline.de/unterkunft-bereitstellen/
- [x] https://warhelp.eu/
- [x] https://www.dhdd.info/
- [x] https://icanhelp.host/ (public API)

```mermaid
flowchart LR;
    subgraph closjure
    I(import) -.-> B(backend)
    end
    subgraph nodejs
    B ==> C{frontend}
    C ==> D(search)
    C -.-> E(submit)
    end
```


```mermaid
flowchart LR;
    subgraph connector
        direction LR
        c_a(REST-api) --> d 
        c_c(crawler)--> d
        c_m(mail crawler) --> d
        d(data)
    end
    subgraph import
        direction LR
        c(csv) --> o(object)
        e(edn) --> o
        j(json) --> o
        xlm(xlm) --> o
        xlsx(xlsx) --> o
        o --> I(mapping)
    end
    subgraph backend
        B(backend) --- db[(db)] 
    end
        c_f(file) --> import
    connector --> import
    import --> backend
```
