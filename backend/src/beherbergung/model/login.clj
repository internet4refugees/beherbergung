(ns beherbergung.model.login
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::mail t/string)  ;; Used as login-name
(s/def ::password-hash t/string)

(s/def ::invited-by t/string)

(s/def ::record (s/keys :req-un [::mail ::password-hash] :opt-un [::invited-by]))


(s/def ::login (s/keys :req-un [::mail ::password-hash]))

(s/def ::login:id t/string)

(s/def ::password t/string)  ;; The unhashed password is not part of the login schema

(s/def ::login:ids (s/or :1 ::login:id
                         :* (s/* ::login:id)))
