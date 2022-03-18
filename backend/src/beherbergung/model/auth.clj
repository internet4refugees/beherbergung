(ns beherbergung.model.auth
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            #_[beherbergung.model.login :as login]))

(s/def ::jwt t/string)

(t/defobject Auth {:name "Auth" :kind t/input-object-kind :description "Authentication requires either a valid mail+password combination or a jwt obtained by an earlier login."}
            :opt-un [:beherbergung.model.login/mail :beherbergung.model.login/password
                     ::jwt])

(s/def ::auth Auth)
