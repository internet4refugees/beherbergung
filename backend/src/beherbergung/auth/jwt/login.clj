(ns beherbergung.auth.jwt.login
  (:require [beherbergung.auth.password.verify-db :refer [login->id]]
            [beherbergung.auth.jwt.defaults :refer [sign unsign]]))

(defn login [ctx mail password]
  (let [login:id (login->id ctx mail password)]
       (when login:id
             (sign {:sub login:id}))))

(defn jwt->id [jwt]
  (:sub (unsign jwt)))
