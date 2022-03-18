(ns wpforms-mails.core
  (:require [config.core :refer [env]]
            [clojure.java.io :as io]
            [mbox-parser.core :as mbox]
            [clojure.string :refer [join]]
            [clojure-mail.message :as cmm]
            [pl.danieljanus.tagsoup :refer [parse-string]]
            [wpforms-mails.parse-hickup :refer [wpforms_html->edn]]
            [data.table.writer :refer [save-table!]])
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
             (->> msg:edn :body :body
                  parse-string))))

(defn -main
 ([] (-main "host-offers.xlsx"))
 ([filename & _args]
  (->> (file->messages (:wpforms-mails-file env))
       (map (fn [message]
            (-> message
                message->html
                wpforms_html->edn)))
       rest  ;; TODO filter valid entries, in my example file all except the first mail are from wpforms
             ;; We should generate and include an example mbox without sensible data for testing…
       (save-table! filename {:workbook-name "Host Offers"}))))

(comment
  (count (mbox->emls (:wpforms-mails-file env)))
  (count (file->messages (:wpforms-mails-file env)))
  (require '[clojure-mail.core :as cmc])
  (message->html (cmc/file->message "/tmp/example"))
  (message->html (second (file->messages (:wpforms-mails-file env))))
  (-main))
