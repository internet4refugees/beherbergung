This repository contains tools for NGOs, organizing private hosting.

## Import of existing datasets

- [x] https://mission-lifeline.de/unterkunft-bereitstellen/
- [x] https://warhelp.eu/
- [x] https://www.dhdd.info/
- [x] https://icanhelp.host/ (public API)

```flow
imp=>start: import|rejected
be=>operation: backend 
(clojure)
fe=>end: end
(NodeJS)

imp(right)->be(right)->fe
```
