(ns beherbergung.resolver.root.ngo.get-columns
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [beherbergung.model.columns :as columns :refer [->graphql]]
            [clojure.edn]))

(s/fdef get_columns
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::columns/columns)))

(defn get_columns
  [_node opt ctx _info]
  (let [;{:keys []} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
         (map ->graphql (clojure.edn/read-string (slurp "./data/config/columns/lifeline/offers.edn"))))))

(s/def ::get_columns (t/resolver #'get_columns))
