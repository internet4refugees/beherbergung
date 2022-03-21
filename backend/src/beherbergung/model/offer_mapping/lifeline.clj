(ns beherbergung.model.offer-mapping.lifeline
  (:require [clojure.spec.alpha :as s]
            [beherbergung.model.offer :refer [int_string]]
            [clojure.string :refer [split]]))

(defn JaNein->bool [JaNein]
  ({"Ja" true "Nein" false} JaNein))

(def mapping {:id_tmp #(or (not-empty (get % "E-Mail")) (get % "Telefonnummer"))
              :source (constantly "lifeline wpforms")

              ;:time_submission_str (constantly nil)
              ;:editor (constantly nil)
              ;:rw_contacted (constantly nil)
              ;:rw_offer_occupied (constantly nil)

              :time_from_str "frühestes Einzugsdatum"
              :time_duration_str "Möglicher Aufenthalt (Dauer)"  ;; for lifeline MM/DD/YYYY

              :beds ["Verfügbare Betten" #(s/conform int_string %)]
              :languages ["Sprachen (sprechen / verstehen)" #(split % #"\n")]

              :place_country "Land"
              :place_city "Ort"
              :place_zip "PLZ"
              :place_street "Straße"
              :place_street_number"Hausnummer"

              :accessible ["Ist die Unterkunft rollstuhlgerecht?" JaNein->bool]
              :animals_allowed ["Haustiere erlaubt?" JaNein->bool]
              :animals_present ["Sind Haustiere im Haushalt vorhanden?" JaNein->bool]

              ;:covid_vaccination_status_str (constantly nil)

              ;:skills_translation (constantly nil)

              :contact_name_full "Name"
              :contact_phone "Telefonnummer"
              :contact_email "E-Mail"
              :note "Nachricht"})
