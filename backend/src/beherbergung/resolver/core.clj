(ns beherbergung.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [mount.core :as mount :refer [defstate]]
            [beherbergung.config.state :refer [env]]
            [beherbergung.db.state :refer [->db_ctx db_ctx]]
            ;; public
            ;; any login
            [beherbergung.resolver.root.login :refer [login]]
            ;; ngo login
            [beherbergung.resolver.root.ngo.get-offers :refer [get_offers]]
            [beherbergung.resolver.root.ngo.get-rw :refer [get_rw]]
            [beherbergung.resolver.root.ngo.write-rw :refer [write_rw]]
            [beherbergung.resolver.root.ngo.get-columns :refer [get_columns]]
            ;; admin passphrase
            [beherbergung.resolver.root.admin.export :refer [export]]))

(def graphql* (executor {:query {:login #'login
                                 :get_offers #'get_offers
                                 :get_rw #'get_rw
                                 :get_columns #'get_columns
                                 :export #'export}
                         :mutation {:write_rw #'write_rw}}))

(defn ->graphql
  "Create a wrapped graphql-executor, that merges context into the request.

   For default usage in the app, the db_ctx should be a singleton handled by mount.
   When {:singleton? true} is used, closing the db (deleting the lock) is provided by mount.

   Since all testcases within a file run in parallel, several db instances are wanted to avoid race conditions.
   It's easy to get an executor with a new db-instance by (->graphql) for testcases with mutations.
   The easiest way of having several instances without worrying about locks is using the config option {:db-inmemory true}."

  [& {:keys [singleton?] :or {singleton? false}}]
  (let [db_ctx (if singleton? db_ctx (->db_ctx))]
       (fn [query]
           (graphql* (-> query
                         (assoc-in [:context :db_ctx]
                                   db_ctx)
                         (assoc-in [:context :validate-output?]
                                   (or (get-in query [:context :validate-output?])
                                       (:validate-output env))))))))

(defstate graphql
  :start (beherbergung.resolver.core/->graphql :singleton? true))
