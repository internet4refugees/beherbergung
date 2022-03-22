(ns beherbergung.model.offer
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [clojure.spec.gen.alpha :as gen]
            [beherbergung.db.export :refer [write-edn]]))

(t/defscalar int_string
  {:name "Int" :description "Integer or String"}
  ;; TODO: Here we should be able to use s/with-gen
  (fn [v]
    (cond
      (nil? v)
        nil
      (number? v)
        (int v)
      (string? v)
        (try
          (Integer/parseInt v)
          (catch NumberFormatException _e v))
      :else
        ::s/invalid)))

(s/def ::t_boolean t/boolean #_ (s/with-gen t/boolean #(s/gen boolean?)))
(s/def ::t_string t/string #_ (s/with-gen t/string #(s/gen string?)))
(s/def ::t_int_string int_string #_ (s/with-gen t/int #(s/gen int?)))
(s/def ::t_float t/float)

(s/def :xt/id t/string)  ;; This is required or we endup with an intropection error
;(s/def :xt/id ::t_string)
(s/def ::id_tmp (s/nilable ::t_string))
(s/def ::source (s/nilable ::t_string))
(s/def ::time_submission_str (s/nilable ::t_string))
(s/def ::editor (s/nilable ::t_string))
(s/def ::edit_date (s/nilable ::t_string))

(s/def ::rw_contacted (s/nilable t/string))
(s/def ::rw_contact_replied (s/nilable t/string))
(s/def ::rw_offer_occupied (s/nilable t/string))
(s/def ::rw_note (s/nilable t/string))

(s/def ::time_from_str (s/nilable ::t_string))
(s/def ::time_duration_str (s/nilable ::t_string))
(s/def ::beds (s/nilable ::t_int_string))
(s/def ::languages (s/nilable (s/* ::t_string)))
(s/def ::place_country (s/nilable ::t_string))
(s/def ::place_city (s/nilable ::t_string))
(s/def ::place_zip (s/nilable ::t_string))
(s/def ::place_street (s/nilable ::t_string))
(s/def ::place_street_number (s/nilable ::t_string))
(s/def ::place_lon (s/nilable ::t_float))
(s/def ::place_lat (s/nilable ::t_float))
(s/def ::skills_translation (s/nilable ::t_boolean))
(s/def ::kids_suitable (s/nilable ::t_boolean))
(s/def ::accessible (s/nilable ::t_boolean))
(s/def ::covid_vaccinated (s/nilable ::t_boolean))
(s/def ::pickup (s/nilable ::t_boolean))
(s/def ::animals_allowed (s/nilable ::t_boolean))
(s/def ::animals_present (s/nilable ::t_boolean))
(s/def ::contact_name_full (s/nilable ::t_string))
(s/def ::contact_phone (s/nilable ::t_string))
(s/def ::contact_email (s/nilable ::t_string))
(s/def ::note (s/nilable ::t_string))
(s/def ::description (s/nilable ::t_string))
(s/def ::offer (s/keys :req-un [::id_tmp
                                ::time_from_str ::time_duration_str ::beds ::languages
                                ::place_country ::place_city ::place_zip ::place_street ::place_street_number
                                ::place_lon ::place_lat
                                ::accessible ::animals_allowed ::animals_present
                                ::contact_name_full ::contact_phone ::contact_email
                                ::note]
                       :opt-un [:xt/id  ;; TODO: when validating the db, we either need check for namespaced keywords or call db->graphql
                                ::source
                                ::time_submission_str
                                ::editor
                                ::rw_contacted ::rw_contact_replied ::rw_offer_occupied ::rw_note
                                ::kids_suitable
                                ::pickup
                                ::covid_vaccinated
                                ::skills_translation
                                ::description]))

(s/def ::offer-rw (s/keys :opt-un [:xt/id
                                   ::editor
                                   ::edit_date

                                   ::rw_contacted ::rw_contact_replied ::rw_offer_occupied ::rw_note

                                   ::time_from_str ::time_duration_str ::beds ::languages
                                   ::place_country ::place_city ::place_zip ::place_street ::place_street_number
                                   ::place_lon ::place_lat
                                   ::accessible ::animals_allowed ::animals_present
                                   ::contact_name_full ::contact_phone ::contact_email
                                   ::note
                                   ::rw_contacted ::rw_contact_replied ::rw_offer_occupied ::rw_note
                                   ::kids_suitable
                                   ::pickup
                                   ::covid_vaccinated
                                   ::skills_translation
                                   ::description]))

(comment
  (write-edn "./data/sample-data/example.edn"
             (gen/sample (s/gen ::offer))))

(s/def ::record ::offer)

(defn db->graphql [record]
  (some-> record
          (assoc :id (:xt/id record))
          (update :source identity)
          (update :time_submission_str identity)
          (update :editor identity)
          (update :edit_date identity)

          (update :rw_contacted identity)
          (update :rw_contact_replied identity)
          (update :rw_offer_occupied identity)
          (update :rw_note identity)

          (update :time_from_str identity)
          (update :time_duration_str identity)
          (update :beds identity)
          (update :languages identity)
          (update :place_country identity)
          (update :place_city identity)
          (update :place_zip identity)
          (update :place_street identity)
          (update :place_street_number identity)
          (update :place_lon identity)
          (update :place_lat identity)
          (update :accessible identity)
          (update :animals_allowed identity)
          (update :animals_present identity)
          (update :contact_name_full identity)
          (update :contact_phone identity)
          (update :contact_email identity)
          (update :note identity)

          (update :kids_suitable identity)
          (update :covid_vaccinated identity)
          (update :skills_translation identity)
          (update :pickup identity)
          (update :description identity)))
