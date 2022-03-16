(ns beherbergung.db.import.offer.ngo.warhelp
  (:require [clojure.edn]
            [beherbergung.model.offer-mapping.core :refer [unify]]
            [beherbergung.model.offer-mapping.warhelp]))

(defn importfile->table [file]
  (take 5 (unify (clojure.edn/read-string (slurp file))  ;; TODO all
         beherbergung.model.offer-mapping.warhelp/mapping)))
