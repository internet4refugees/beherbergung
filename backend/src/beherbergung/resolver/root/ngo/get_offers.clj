(ns beherbergung.resolver.root.ngo.get-offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [beherbergung.model.offer :as offer :refer [db->graphql]]))

(s/fdef get_offers
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::offer/offer)))

(defn get_offers
  "The offers that are visible for the ngo, belonging to the login"
  [_node opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
             (map db->graphql
               (q_unary '{:find [(pull ?e [*])]
                          :where [[?e :xt/spec ::offer/record]
                                  [?e ::ngo/id ngo:id]]
                          :in [ngo:id]}
                         ngo:id)))))

(s/def ::get_offers (t/resolver #'get_offers))
