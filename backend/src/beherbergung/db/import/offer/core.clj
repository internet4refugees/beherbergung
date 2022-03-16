(ns beherbergung.db.import.offer.core
  (:require [beherbergung.config.state :refer [env]]
            [beherbergung.db.import.offer.helper :refer [update-offers]]
            [beherbergung.db.import.offer.ngo.random :as random]
            [beherbergung.db.import.offer.ngo.lifeline :as lifeline]))

(defn import! []
  (if-not (:import-ngo env)
    (println "No IMPORT_NGO defined")
    (let [table (if-not (:import-file env)
                        (random/importfile->table)
                        (case (:import-ngo env)
                          "lifeline_beherbergung"
                            (lifeline/importfile->table (:import-file env))
                          (random/importfile->table)))]
         (println "Records to be imported:" (count table))
         (update-offers (:import-ngo env) table)
         (println "import finished :)"))))

(comment
  (import!)

  (let [ngo:id "lifeline_beherbergung"
        _ (require '[beherbergung.db.state :refer [db_ctx]])
        {:keys [q_unary]} db_ctx]
       (-> (q_unary '{:find [(pull ?e [*])]
                      :where [[?e :xt/spec :beherbergung.model.offer/record]
                              [?e :beherbergung.model.ngo/id ngo:id]]
                      :in [ngo:id]}
                    ngo:id))))
