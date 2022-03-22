(ns beherbergung.model.offer-mapping.warhelp
  (:require [clojure.string :refer [split]]))

(defn not-empty? [v]
  (boolean (not-empty v)))

(defn yesNo->bool [yesNo]
  ({"Yes / Ja" true "No / Nein" false
    "yes" true "no" false
    "ja" true "nein" false} yesNo))

(defn x->bool [x]
  ({"x" true "" false} x))

(defn vaccinated->bool [s]
  ({"Vaccinated / Geimpft" true "Unvaccinated / Ungeimpft" false} s))

(defn split_user_string
  "TODO handle common separators entered by users like `,` or `and`"
  [s]
  (split s #" "))

(def mapping {:id_tmp #(or (not-empty (get % "E-Mail ")) (get % "Phone"))
              :source (constantly "warhelp.eu google-docs")

              :time_submission_str "Zeitstempel"
              :editor "Bearbeiter*in"
              :rw_contacted ["contacted at least once" x->bool]
              :rw_offer_occupied ["Occupied" not-empty?]

              :time_from_str "Available from- / Verfügbar von- "
              :time_duration_str "For how long? / Für wieviele Wochen?"

              :beds "How many people can you host max.? / Wievielen Menschen können sie maximal Unterkunft bieten?"
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
              :kids_suitable ["Is the Accommodation Suitable for young Kids?  /  Ist die Unterkunft für Kleinkinder geeignet?"yesNo->bool]
              :animals_allowed ["Are Animals allowed? / Sind Tiere erlaubt?" yesNo->bool]
              :animals_present (constantly nil)

              :covid_vaccinated ["What is your vaccination status? / Wie ist Ihr Impfstatus? " vaccinated->bool]

              :skills_translation ["Can you offer to help other hosts with translations from Ukrainian to German/English? / Können Sie anderen Gastgebern bei Übersetzungen aus dem Ukrainischen ins Deutsche/Englische helfen?" yesNo->bool]
              :pickup ["Would you pick up  your guests when they arrive at HBF Vienna? Würden Sie ihre Gäste beim Hauptbahnhof Wien abholen? " yesNo->bool]

              :contact_name_full "Name "
              :contact_phone "Phone"
              :contact_email "E-Mail "
              :note "Anything else to keep in mind? Allergies? / Gibt es sonst noch etwas zu bedenken? Allergien?"
              :description "Describe the place you can offer with a few words. (Whole Apartment/Couch) / Beschreiben Sie den Ort, den Sie anbieten können, mit ein paar Worten. (Wohnung/Couch)"
             })
