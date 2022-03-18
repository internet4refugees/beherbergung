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

(s/def :xt/id ::t_string)
(s/def ::id_tmp (s/nilable ::t_string))
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
(s/def ::accessible (s/nilable ::t_boolean))
(s/def ::animals_allowed (s/nilable ::t_boolean))
(s/def ::animals_present (s/nilable ::t_boolean))
(s/def ::contact_name_full (s/nilable ::t_string))
(s/def ::contact_phone (s/nilable ::t_string))
(s/def ::contact_email (s/nilable ::t_string))
(s/def ::note (s/nilable ::t_string))
(s/def ::offer (s/keys :req-un [:xtdb.api/id ::id_tmp
                                ::time_from_str ::time_duration_str ::beds ::languages
                                ::place_country ::place_city ::place_zip ::place_street ::place_street_number
                                ::place_lon ::place_lat
                                ::accessible ::animals_allowed ::animals_present
                                ::contact_name_full ::contact_phone ::contact_email
                                ::note]))

(comment
  (write-edn "./data/sample-data/example.edn"
             (gen/sample (s/gen ::offer))))

(s/def ::record ::offer)

(defn db->graphql [record]
  (some-> record
          (assoc :id (:xt/id record))))
