(ns beherbergung.auth.jwt.defaults
  (:require [beherbergung.auth.jwt.state :refer [secret]]
            [buddy.sign.jwt]
            [buddy.sign.util :refer [now]]))

(def default_validity:seconds (* 24 60 60))  ;; 1 Day

(defn sign
 "Wrap around buddy.sign.jwt/sign, using the secret provided by mount and adds an expiration date."  
 ([data]
  (sign data default_validity:seconds))
 ([data validity]
  (when (< (count secret) beherbergung.auth.jwt.state/secret_length:bytes)
        (throw (Exception. "Secret too short")))
  (buddy.sign.jwt/sign (assoc data :exp (+ (now) validity))
                       secret)))

(defn unsign [jwt]
  (buddy.sign.jwt/unsign jwt secret))
