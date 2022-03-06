(ns beherbergung.auth.password.hash
  (:require [cryptohash-clj.api :refer [hash-with verify-with]]))

(defn hash-password [password]
  (let [algo :argon2
        args {}]
       (hash-with algo password args)))

(defn verify-password [password pwhash]
  (if (empty? pwhash)
      false
      (let [algo :argon2]
           (verify-with algo password pwhash))))
