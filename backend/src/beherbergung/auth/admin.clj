(ns beherbergung.auth.admin
  (:require [beherbergung.config.state :refer [env]]))

(defn admin?
  "For now, we require only one administrator login.
   It can be configured by the environmment variable ADMIN_PASSPHRASE
  "
  [passphrase]
  (and (:admin-passphrase env)
       (= passphrase (:admin-passphrase env))))
