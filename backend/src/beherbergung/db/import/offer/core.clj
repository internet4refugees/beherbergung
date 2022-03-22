(ns beherbergung.db.import.offer.core
  (:require [beherbergung.config.state :refer [env]]
            [beherbergung.db.import.offer.helper :refer [update-offers]]
            [beherbergung.db.import.offer.ngo.random :as random]
            [beherbergung.db.import.offer.ngo.lifeline :as lifeline]
            [beherbergung.db.import.offer.ngo.warhelp :as warhelp]
            [beherbergung.db.import.offer.ngo.public.icanhelp :as icanhelp]))

(defn import-public!
  "Import datasets from public apis"
  ([] (import-public! (or (:import-limit env) ##Inf)))
  ([limit]
    (println "Import public Datasets")
    (let [table-limited (->> (icanhelp/api->table)
                             (take limit))]
         table-limited
         (update-offers :public table-limited))))

(defn import-private!
  "Import datasets visible only to a single ngo"
  ([] (import-private! (or (:import-limit env) ##Inf)))
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

(defn import! [& args]
  (apply import-private! args)
  (when (:import-public env)
        (apply import-public! args)))


(comment
  "This functions can be helpfull for testing…"

  (import-public! 99)

  (import! 10)

  (require '[beherbergung.db.state :refer [db_ctx]])
  (let [ngo:ids [:public #_"warhelp_beherbergung"]
        {:keys [q_unary]} db_ctx]
       (->> (q_unary '{:find [(pull ?e [*])]
                       :where [[?e :xt/spec :beherbergung.model.offer/record]
                               [?e :beherbergung.model.ngo/id ngo:id]]
                       :in [[ngo:id ...]]}  ;; Collection binding
                     ngo:ids)
            #_(reverse)  ;; often usefull to see the latest entries
            #_(drop 214)
            (take 10)
            #_(map :id_tmp)
            #_(remove nil?))))
