(ns beherbergung.model.offer-rw
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::rw_note (s/nilable t/string))

(s/def ::record (s/keys :req-un [::rw_note]))

(defn db->graphql [record]
  (some-> record
          ;(select-keys [:xt/id :rw_note])
          (assoc :id (:xt/id record))))
