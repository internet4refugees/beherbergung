(ns beherbergung.db.state
  (:require[xtdb.api :as xtdb]
            [clojure.java.io :as io]
            [beherbergung.db.export :refer [export seed ]]
            [mount.core :as mount :refer [defstate]]
            [beherbergung.config.state :refer [env]]
            [beherbergung.db.validate :refer [validate-db validate-tx]]))

(defn export-named-by-date [db_ctx cause]
  (when (and (not (:db-inmemory env))
             (not-empty (:db-export-prefix env)))
        (let [date (.format (java.text.SimpleDateFormat. "yyyyMMdd_HHmmss")
                            (.getTime (java.util.Calendar/getInstance)))
              file (str (:db-export-prefix env) date "_" cause ".edn")]
             (when (:verbose env)
                   (println "Export database to:" file))
             (io/make-parents file)
             (export file db_ctx))))

(defn submit-tx [node tx-ops]
  (xtdb/submit-tx node (validate-tx tx-ops)))

(defn q [node & args]
  (apply xtdb/q (xtdb/db node) args))

(defn ->db_ctx []
  (let [node (xtdb/start-node (when-not (:db-inmemory env)
                                        {:my-rocksdb {:xtdb/module 'xtdb.rocksdb/->kv-store
                                                      :db-dir (clojure.java.io/file (:db-dir env))
                                                      :sync? true}
                                         :xtdb/tx-log {:kv-store :my-rocksdb}
                                         :xtdb/document-store {:kv-store :my-rocksdb}}))  ;; To optimize for read performance, we might switch to LMDB (B-Tree instead of LSM-Tree)
                                                                                          ;; But for our workload it doesn't matter much
        db_ctx {:node node
                :tx (fn [tx-ops]
                        (submit-tx node tx-ops))
                :tx_sync (fn [tx-ops]
                             (->> (submit-tx node tx-ops)
                                  (xtdb.api/await-tx node)))
                :tx-committed? (fn [transaction]
                                   #_(println "synced" (xtdb/sync node))
                                   #_(println "awaited" (xtdb/await-tx node transaction))
                                   (xtdb/tx-committed? node transaction))
                :tx-fn-put (fn [fn-name quoted-fn]
                               ;; In future we may want add transaction functions only once (at startup)
                               (xtdb/submit-tx node [[::xtdb/put {:xt/id fn-name :xt/fn quoted-fn}]]))
                :tx-fn-call (fn [fn-name & args]
                                (xtdb/submit-tx node [(concat [::xtdb/fn fn-name] args)]))
                :sync (fn [] (xtdb/sync node))
                :q (fn [& args]
                       (apply q node args))
                :q_unary (fn [& args]
                             ;; A query returning unary results
                             (->> (apply q node args)
                                  (map first)))
                :q_id (fn [& args]
                           ;; A query returning only 1 result
                           (-> (apply q node args)
                               first))
                :q_id_unary (fn [& args]
                                ;; A query returning only 1 unary result
                                (-> (apply q node args)
                                    ffirst))}]

       (export-named-by-date db_ctx "start")  ;; before seeding

       ;; There is no default seed file, to prevent loading it into the production system
       (if (:db-seed env)
           (do (when (:verbose env)
                     (println "Seed the database from:" (:db-seed env)))
               (seed (:db-seed env) db_ctx))
           (println "WARNING: Seeding the database requires setting $DB_SEED"
                    "consider: DB_SEED=src/beherbergung/db/seed/test.edn"))
      
       (if (:db-validate env)
           (or (validate-db db_ctx)
               (System/exit 1))
           db_ctx)))

(defstate db_ctx
  :start (->db_ctx)
  :stop (do (export-named-by-date db_ctx "stop")
            (.close (:node db_ctx))))
