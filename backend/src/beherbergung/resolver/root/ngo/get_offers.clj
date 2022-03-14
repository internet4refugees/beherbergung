(ns beherbergung.resolver.root.ngo.get-offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.config.state :refer [env]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [beherbergung.model.offer :as offer]
            [beherbergung.model.offer-mapping.core :refer [unify]]
            [beherbergung.model.offer-mapping.lifeline]
            [clojure.edn]))

(defn mock_geocoding
  "just to provide sample data while developing the frontend"
  [table]
  (map #(-> %
            (assoc :place_lon  12.34
                   :place_lat 51.34))
       table))

(s/fdef get_offers
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::offer/offer)))


(defn get_offers
  "The offers that are visible for the ngo, belonging to the login"
  [_node opt ctx _info]
  (let [{:keys [_TODO]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
         ;; TODO: take it from the db and filter it by visibility to the ngo
         ;; When importing, we want define to which ngo the imported dataset is visible
         (mock_geocoding  ;; TODO
           (if (:import-file env)
               (unify (clojure.edn/read-string (slurp (:import-file env)))
                      beherbergung.model.offer-mapping.lifeline/mapping)
               (clojure.edn/read-string (slurp "./data/sample-data/example.edn"))  ;; till conflict between `specialist-server.type` and `with-gen` is fixed
               #_(gen/sample (s/gen ::offer)))))))

(s/def ::get_offers (t/resolver #'get_offers))
