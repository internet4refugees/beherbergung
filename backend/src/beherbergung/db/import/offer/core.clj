(ns beherbergung.db.import.offer.core
  (:require [beherbergung.config.state :refer [env]]
            [beherbergung.db.import.offer.helper :refer [update-offers]]
            [beherbergung.db.import.offer.ngo.random :as random]
            [beherbergung.db.import.offer.ngo.lifeline :as lifeline]
            [beherbergung.db.import.offer.ngo.warhelp :as warhelp]))

(defn import!
 ([] (import! ##Inf))
 ([limit]
  (if-not (:import-ngo env)
    (println "No IMPORT_NGO defined")
    (let [table (if-not (:import-file env)
                        (random/importfile->table)
                        (case (:import-ngo env)
                          "lifeline_beherbergung"
                            (lifeline/importfile->table (:import-file env))
                          "warhelp_beherbergung"
                            (warhelp/importfile->table (:import-file env))
                          (random/importfile->table)))
          table-limited (take limit table)]
         (println "Records to be imported:" (count table-limited))
         (update-offers (:import-ngo env) table-limited)
         (println "import finished :)")))))

(comment
  (import! 10)

  (require '[beherbergung.db.state :refer [db_ctx]])
  (let [ngo:id "warhelp_beherbergung"
        {:keys [q_unary]} db_ctx]
       (->> (q_unary '{:find [(pull ?e [*])]
                       :where [[?e :xt/spec :beherbergung.model.offer/record]
                               [?e :beherbergung.model.ngo/id ngo:id]]
                       :in [ngo:id]}
                     ngo:id)
            #_(map :id_tmp))))
