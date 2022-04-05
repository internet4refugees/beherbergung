(ns beherbergung.db.import.offer.ngo.warhelp
  (:require [clojure.edn]
            [beherbergung.model.offer-mapping.core :refer [unify grouping]]
            [beherbergung.model.offer-mapping.warhelp]))

(defn importfile->table [file]
  (-> (unify (clojure.edn/read-string (slurp file))
             beherbergung.model.offer-mapping.warhelp/mapping)
      grouping))
