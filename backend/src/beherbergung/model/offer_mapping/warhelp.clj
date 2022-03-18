(ns beherbergung.model.offer-mapping.warhelp
  (:require [clojure.string :refer [split]]))

(defn split_user_string
  "TODO handle common separators entered by users like `,` or `and`"
  [s]
  (split s #" "))

(def mapping {:id_tmp #(or (not-empty (get % "E-Mail ")) (get % "Phone"))

              :time_from_str (constantly nil)
              :time_duration_str "Available from- , to / Verfügbar von- bis"

              :beds "How many people can you host? / Wievielen Menschen können sie Unterkunft bieten?"
              :languages ["The language you speak / Gesprochene Sprachen" split_user_string]

              :place_country "Country / Land"
              :place_city (constantly nil)
              :place_zip (constantly nil)
              :place_street (constantly nil)
              :place_street_number (constantly nil)
              :place_str #(or (not-empty (get % "Address (+ zip code!)"))
                              (get % "Address (+ zip code!) / Adresse (+ PLZ)"))

              :accessible (constantly nil)
              :animals_allowed (constantly nil)
              :animals_present (constantly nil)

              :contact_name_full "Name "
              :contact_phone "Phone"
              :contact_email "E-Mail "
              :note "Anything else to keep in mind? Animals? Allergies? / Gibt es sonst noch etwas zu bedenken? Tiere? Allergien?"})
