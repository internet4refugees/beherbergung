(ns beherbergung.db.import.offer.ngo.random
  (:require [clojure.edn]))

(defn importfile->table [& file]
  (clojure.edn/read-string (slurp (or file "./data/import/example.edn")))
  ;; once conflict between `specialist-server.type` and `with-gen` is fixed
  #_(gen/sample (s/gen ::offer)))
