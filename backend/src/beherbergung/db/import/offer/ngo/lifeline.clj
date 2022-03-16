(ns beherbergung.db.import.offer.ngo.lifeline
  (:require [clojure.edn]
            [beherbergung.model.offer-mapping.core :refer [unify]]
            [beherbergung.model.offer-mapping.lifeline]))

(defn importfile->table [file]
  (unify (clojure.edn/read-string (slurp file))
         beherbergung.model.offer-mapping.lifeline/mapping))
