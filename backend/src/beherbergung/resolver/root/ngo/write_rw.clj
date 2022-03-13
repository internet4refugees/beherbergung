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
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::oneditcomplete/onEditComplete]) map? map?)
        :ret (s/nilable t/boolean))

(defn write_rw
  [_node opt ctx _info]
  (let [{:keys [tx_sync tx-committed?]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (boolean (when ngo:id
         (let [{:keys [value columnId rowId]} (:onEditComplete opt)
               t (tx_sync [;; TODO use :xtdb.api/match to verify we update the latest version instead of last write wins
                           [:xtdb.api/put {:xt/id rowId
                                           :xt/spec ::offer-rw/record
                                           (keyword columnId) value}]])]
              (tx-committed? t))))))

(s/def ::get_offers (t/resolver #'write_rw))
