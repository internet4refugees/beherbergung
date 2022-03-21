(ns beherbergung.model.offer-mapping.warhelp
  (:require [clojure.string :refer [split]]))

(defn not-empty? [v]
  (boolean (not-empty v)))

(defn x->bool [x]
  ({"x" true "" false} x))

(defn yesNo->bool [yesNo]
  ({"yes" true "no" false} yesNo))

(defn split_user_string
  "TODO handle common separators entered by users like `,` or `and`"
  [s]
  (split s #" "))

(def mapping {:id_tmp #(or (not-empty (get % "E-Mail ")) (get % "Phone"))

              :time_submission_str "Zeitstempel"
              :editor "Bearbeiter*in"
              :rw_contacted ["contacted at least once" x->bool]
              :rw_offer_occupied ["Occupied" not-empty?]

              :time_from_str "Available from- / Verfügbar von- "
              :time_duration_str "For how long? / Für wieviele Wochen?"

              :beds "How many people can you host? / Wievielen Menschen können sie Unterkunft bieten?"
              :languages ["The language you speak / Gesprochene Sprachen" split_user_string]

              :place_country "Country / Land"
              :place_city "City / Stadt"
              :place_zip "Zip Code / Postleitzahl"
              :place_street "Address / Adresse "
              :place_street_number (constantly nil)
              :place_str (constantly nil)
                         ; #(or (not-empty (get % "Address (+ zip code!)"))
                         ;      (get % "Address (+ zip code!) / Adresse (+ PLZ)"))

              :accessible ["Is your accommodation handicapped accessible? / Ist Ihre Unterkunft Barrierefrei zugänglich?" yesNo->bool]
              :animals_allowed ["Are Animals allowed? / Sind Tiere erlaubt?" yesNo->bool]
              :animals_present (constantly nil)

              :covid_vaccination_status_str "What is your vaccination status? / Wie ist Ihr Impfstatus? "

              :skills_translation ["Can you offer helping other hosts with translations from Ukrainian to German/English? / Können Sie anderen Gastgebern bei Übersetzungen aus dem Ukrainischen ins Deutsche/Englische helfen?" yesNo->bool]

              :contact_name_full "Name "
              :contact_phone "Phone"
              :contact_email "E-Mail "
              :note "Anything else to keep in mind? Animals? Allergies? / Gibt es sonst noch etwas zu bedenken? Tiere? Allergien?"})
