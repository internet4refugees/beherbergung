(ns beherbergung.auth.mail.local.mailutils
  (:require [clojure.java.shell :refer [sh]]))

(defn send-message
 "A plugin replacement for com.draines/postal to be used with GNU Mailutils"
 ([_server msg] (send-message msg))
 ([msg]
  (sh "mail" "-s" (str (:subject msg))
             (str "-aFrom:" (:from msg))
             (str (:to msg))
      :in (str (:body msg)))))
