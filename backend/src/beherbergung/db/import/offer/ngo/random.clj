(ns beherbergung.db.import.offer.ngo.random
  (:require [clojure.edn]))

(defn importfile->table []
  (clojure.edn/read-string (slurp "./data/import/example.edn"))
  ;; once conflict between `specialist-server.type` and `with-gen` is fixed
  #_(gen/sample (s/gen ::offer)))
