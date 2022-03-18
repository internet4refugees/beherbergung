(ns beherbergung.resolver.root.ngo.get-rw
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [beherbergung.model.offer-rw :as offer-rw :refer [db->graphql]]
            [clojure.edn]))

(s/fdef get_rw
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::offer-rw/record)))

(defn get_rw
  [_node opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
             (map db->graphql
               (q_unary '{:find [(pull ?e [*])]
                          :where [[?e :xt/spec ::offer-rw/record]]})))))

(s/def ::get_offers (t/resolver #'get_rw))
