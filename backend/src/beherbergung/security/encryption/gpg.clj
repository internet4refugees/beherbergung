(ns beherbergung.security.encryption.gpg
  (:require [clojure.java.shell :refer [sh]]))

(defn encrypt
  "Requires `gpg` to be installed and the keyid to be in the keyring"
  [plaintext keyid]
  (sh "gpg" "--batch" "--encrypt" "--recipient" keyid "--armor"
      :in plaintext))

#_(defn encrypt
  "This version should better be audited before using it"
  [plaintext keyids]
  (let [recipient_args (interleave (repeatedly (constantly "--recipient"))
                                   (map str keyids))
        sh_options [:in plaintext]
        args (concat ["gpg" "--batch" "--encrypt"] recipient_args ["--armor"] sh_options)]
       (apply sh args)))
