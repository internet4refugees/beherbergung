(ns beherbergung.resolver.root.ngo.get-offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.config.state :refer [env]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [clojure.edn]))

(defn JaNein->bool [JaNein]
  ({"Ja" true "Nein" false} JaNein))

(def mapping {:accessible #(JaNein->bool (get % "Ist die Unterkunft rollstuhlgerecht?"))
              :note "Nachricht"})

(defn unify
  [offers]
  (let [mapping->fn (fn [mapping]
                        (fn [dataset] (->> mapping
                                           (map (fn [[k v]]
                                                    [k (cond (fn? v)
                                                               (v dataset)
                                                             :else
                                                               (get dataset v))]))
                                           (into {}))))]
       (map (mapping->fn mapping) offers)))

(s/def ::accessible (s/nilable t/boolean))
(s/def ::note (s/nilable t/string))
(s/def ::offer (s/keys :opt-un [::accessible ::note]))

(s/fdef get_offers
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::offer)))

(defn get_offers
  "The offers that are visible for the ngo, belonging to the login"
  [_node opt ctx _info]
  (let [{:keys [_TODO]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
         ;; TODO: take it from the db and filter it by visibility to the ngo
         (unify (clojure.edn/read-string (slurp (:import-file env)))))))

(s/def ::get_offers (t/resolver #'get_offers))
