(ns beherbergung.model.offer-rw
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def :xt/id t/string)
(s/def ::rw_contacted (s/nilable t/string))
(s/def ::rw_contact_replied (s/nilable t/string))
(s/def ::rw_offer_occupied (s/nilable t/string))
(s/def ::rw_note (s/nilable t/string))

(s/def ::record (s/keys :opt-un [:xt/id ::rw_contacted ::rw_contact_replied ::rw_offer_occupied ::rw_note]))

(defn add_missing
  "TODO: provide this as a reusable feature of specialist-server"
  [record]
  (-> record
      (update :rw_contacted identity)
      (update :rw_contact_replied identity)
      (update :rw_offer_occupied identity)
      (update :rw_note identity)))

(defn db->graphql [record]
  (some-> record
          (add_missing)
          (assoc :id (:xt/id record))))
