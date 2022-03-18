# Access via repl:

```bash
lein repl  ## from somewhere within the `backend` directory
```

```clojure-repl
(require '[beherbergung.db.state :refer [db_ctx]])  ;; get a database context
(require '[clojure.pprint :refer [pprint]])

;; This example queries all offers
(pprint ((:q db_ctx) '{:find [(pull ?e [*])]
                       :where [[?e :xt/spec :beherbergung.model.offers/record]]}))
```

To learn more about the datalog query syntax, please use the [XTDB language reference](https://docs.xtdb.com/language-reference/datalog-queries/).

# Web UI

If you are looking for a Web UI for inspecting the XTDB database, you may want use [XTDB inspector](https://github.com/tatut/xtdb-inspector).

It is a separate project and not bundled into beherbergung. To connect to your database, you will need to adjust `dev-src/user.clj`.
