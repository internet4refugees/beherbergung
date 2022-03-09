(ns beherbergung.resolver.root.ngo.get-offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.auth.core :refer [auth+role->entity]]
            [beherbergung.config.state :refer [env]]
            [beherbergung.model.auth :as auth]
            [beherbergung.model.ngo :as ngo]
            [clojure.edn]
            [clojure.spec.gen.alpha :as gen]
            [beherbergung.db.export :refer [write-edn]]
            [clojure.string :refer [split]]))

(defn JaNein->bool [JaNein]
  ({"Ja" true "Nein" false} JaNein))

(defn ->Int [s]
  (try
    (Integer/parseInt s)
    (catch NumberFormatException _e)))

(def mapping_lifeline_wpforms {;; TODO: the times are not parsed till now
                               :time_from_str "frühestes Einzugsdatum"
                               :time_duration_str "Möglicher Aufenthalt (Dauer)"

                               :beds ["Verfügbare Betten" ->Int]
                               :languages ["Sprachen (sprechen / verstehen)" #(split % #",")]

                               :place_country "Land"
                               :place_city "Ort"
                               :place_zip "PLZ"
                               :place_street "Straße"
                               :place_street_number"Hausnummer"

                               :accessible ["Ist die Unterkunft rollstuhlgerecht?" JaNein->bool]
                               :animals_allowed ["Haustiere erlaubt?" JaNein->bool]
                               :animals_present ["Sind Haustiere im Haushalt vorhanden?" JaNein->bool]

                               :contact_name_full "Name"
                               :contact_phone "Telefonnummer"
                               :contact_email "E-Mail"
                               :note "Nachricht"})
(def mapping_identity {:accessible :accessible
                       :note :note})

(defn unify
  [offers mapping]
  (let [mapping->fn (fn [mapping]
                        (fn [dataset] (->> mapping
                                           (map (fn [[k v]]
                                                    [k (cond (fn? v)
                                                               (v dataset)
                                                             (vector? v)
                                                               (let [[orig_kw parse_fn] v]
                                                                    (parse_fn (get dataset orig_kw)))
                                                             :else
                                                               (get dataset v))]))
                                           (into {}))))]
       (map (mapping->fn mapping) offers)))

(s/def ::t_boolean t/boolean #_ (s/with-gen t/boolean #(s/gen boolean?)))
(s/def ::t_string t/string #_ (s/with-gen t/string #(s/gen string?)))
(s/def ::t_int t/int #_ (s/with-gen t/int #(s/gen int?)))

(s/def ::time_from_str (s/nilable ::t_string))
(s/def ::time_duration_str (s/nilable ::t_string))
(s/def ::beds (s/nilable ::t_int))
(s/def ::languages (s/nilable (s/* ::t_string)))
(s/def ::place_country (s/nilable ::t_string))
(s/def ::place_city (s/nilable ::t_string))
(s/def ::place_zip (s/nilable ::t_string))
(s/def ::place_street (s/nilable ::t_string))
(s/def ::place_street_number (s/nilable ::t_string))
(s/def ::accessible (s/nilable ::t_boolean))
(s/def ::animals_allowed (s/nilable ::t_boolean))
(s/def ::animals_present (s/nilable ::t_boolean))
(s/def ::contact_name_full (s/nilable ::t_string))
(s/def ::contact_phone (s/nilable ::t_string))
(s/def ::contact_email (s/nilable ::t_string))
(s/def ::note (s/nilable ::t_string))
(s/def ::offer (s/keys :req-un [::time_from_str ::time_duration_str ::beds ::languages
                                ::place_country ::place_city ::place_zip ::place_street ::place_street_number
                                ::accessible ::animals_allowed ::animals_present
                                ::contact_name_full ::contact_phone ::contact_email
                                ::note]))

(comment
  (write-edn "./data/sample-data/example.edn"
             (gen/sample (s/gen ::offer))))

(s/fdef get_offers
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable (s/* ::offer)))


(defn get_offers
  "The offers that are visible for the ngo, belonging to the login"
  [_node opt ctx _info]
  (let [{:keys [_TODO]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/record)]
       (when ngo:id
         ;; TODO: take it from the db and filter it by visibility to the ngo
         (if (:import-file env)
             (unify (clojure.edn/read-string (slurp (:import-file env)))
                    mapping_lifeline_wpforms)
             (gen/sample (s/gen ::offer))))))

(s/def ::get_offers (t/resolver #'get_offers))
