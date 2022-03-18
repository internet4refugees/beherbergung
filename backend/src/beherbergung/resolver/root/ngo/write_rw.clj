(ns beherbergung.resolver.root.ngo.write-rw
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.model.ngo :as ngo]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.oneditcomplete :as oneditcomplete]
            [beherbergung.model.offer-rw :as offer-rw]
            [clojure.edn]))

(s/fdef write_rw
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::oneditcomplete/onEditCompleteByType]) map? map?)
        :ret (s/nilable t/boolean))

(defn write_rw
  [_node opt ctx _info]
  (let [{:keys [tx-fn-put tx-fn-call sync]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)
        tx_result (when ngo:id
                        (let [{:keys [rowId columnId
                                      value_boolean value_string]} (:onEditCompleteByType opt)
                              value (or value_boolean value_string)
                              doc {(keyword columnId) value}]
                             (tx-fn-put :write_rw
                                   '(fn [ctx eid doc]
                                        (let [db (xtdb.api/db ctx)
                                              entity (xtdb.api/entity db eid)]
                                             [[:xtdb.api/put (assoc (merge entity doc)
                                                                    :xt/id eid
                                                                    :xt/spec ::offer-rw/record)]])))
                             (tx-fn-call :write_rw (str "rw_" rowId) doc)))]
       (sync)
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::get_offers (t/resolver #'write_rw))
