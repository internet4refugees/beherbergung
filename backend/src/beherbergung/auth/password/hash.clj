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


(comment
  (do (require '[beherbergung.auth.password.hash :refer [hash-password]])
      (require '[beherbergung.auth.password.generate :refer [generate-password]])
      (require 'clojure.string))
  ;; Create a single pw + hash
  (let [pw (generate-password)] (prn (hash-password pw) pw))
  ;; Bulk creation of users
  (let [mails ["a@bc.de" "ab@c.de"]
        mail+pw (doall (for [mail mails
                             :let [pw (generate-password)
                                   pw:hash (hash-password pw)]]
                            ;; Print database entries of users + comment with password (for the DB_SEED)
                            (do (pr {:xt/id (str "login_" mail)
                                     :xt/spec :beherbergung.model.login/record
                                     :mail mail
                                     :password-hash pw:hash})
                                (print "  ;; ") (prn pw)
                                (str mail " " pw))))]
       ;; List of new userIds that should be added to the ngo (in DB_SEED)
       (prn (map #(str "login_" %) mails))
       ;; Human readable list of mail + pw
       (prn (clojure.string/join "     " mail+pw))))
