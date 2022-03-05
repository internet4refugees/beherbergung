(ns wpforms-mails.core
  (:require [config.core :refer [env]]
            [clojure.java.io :as io]
            [mbox-parser.core :as mbox]
            [clojure.string :refer [join]]
            [clojure-mail.message :as cmm])
  (:import [java.util Properties]
           [javax.mail Session]
           [javax.mail.internet MimeMessage])
  (:gen-class))

(defn mbox->emls
  "split an .mbox file (multiple mails) into a sequence of mails"
  [filename]
  (->> (io/reader filename)
       (mbox-parser.core/parse-reader)
       (map #(join "\n" %))))

(defn eml->message
  "convert an eml string into a MimeMessage"
  [eml]
  (let [props (Session/getDefaultInstance (Properties.))
        is (java.io.ByteArrayInputStream. (.getBytes eml #_"UTF-8"))]
       (MimeMessage. props is)))

(defn file->messages
  "a substitution for [(cmc/file->message filename)] that can handle files containing multiple mails (mbox)"
  [filename]
  (map eml->message (mbox->emls filename)))

(defn message->html
  "parse the html body of a MimeMessage"
  [message]
  (let [msg:edn (cmm/read-message message)]
       (when (= (:content-type msg:edn) "text/html; charset=utf-8")
             (-> msg:edn :body :body))))

(defn -main
  [& _args]
  (map message->html
       (file->messages (:wpforms-mails-file env))))

(comment
  (count (mbox->emls (:wpforms-mails-file env)))
  (count (file->messages (:wpforms-mails-file env)))
  (message->html (cmc/file->message "/tmp/example"))
  (message->html (second (file->messages (:wpforms-mails-file env))))
  (-main))
