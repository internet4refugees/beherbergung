(ns beherbergung.resolver.root.ngo.ngo-example
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]))

(s/def ::my_result_type t/string)

(s/fdef ngo_example
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable ::my_result_type))

(defn ngo_example
  "For an ngo login, we get a greeting"
  [_node opt ctx _info]
  (let [{:keys [_TODO]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
         "hallo welt :)")))

(s/def ::ngo_example (t/resolver #'ngo_example))
