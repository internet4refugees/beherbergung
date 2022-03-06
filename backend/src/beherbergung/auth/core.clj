(ns beherbergung.auth.core
  (:require [beherbergung.auth.password.verify-db :refer [login->id id->roles+entities]]
            [beherbergung.auth.jwt.login :refer [jwt->id]]))

(defn auth->id [ctx auth]
  (cond (:jwt auth)
          (jwt->id (:jwt auth))
        (and (:mail auth) (:password auth))
          (login->id ctx (:mail auth) (:password auth))))

(defn auth+role->entity
  [ctx auth role]
  (let [login:id (auth->id ctx auth)
        roles+entities (id->roles+entities ctx login:id)
        entities (->> (filter #(= role (:role %)) roles+entities)
                      (map :entity))]
       (when (and login:id
                  (<= (count entities) 1))
             [(first entities) login:id])))
