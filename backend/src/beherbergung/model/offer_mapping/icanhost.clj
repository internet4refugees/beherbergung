(ns beherbergung.model.offer-mapping.icanhost
  (:require [clojure.spec.alpha :as s]
            [beherbergung.model.offer :refer [int_string]]))

(defn ->float [s]
  (try (Float/parseFloat s)
       (catch Exception _e)))

(def mapping {:id_tmp :id
              :source (constantly "icanhelp.host")

              :time_from_str (constantly nil)
              :time_duration_str (constantly nil)

              :beds [:Accommodation #(s/conform int_string %)]
              :languages :Languages

              :place_country :Country
              :place_city :City
              :place_zip :Postcode
              :place_street (constantly nil)
              :place_street_number (constantly nil)

              :accessible (constantly nil)
              :animals_allowed (constantly nil)
              :animals_present (constantly nil)
              :contact_name_full :Name
              :contact_phone #(or (not-empty (:Signal %)) (not-empty (:Telegram %)) (not-empty (:Whatsapp %)) (not-empty (:Viber %)))
              :contact_email (constantly nil)
              :note (keyword "Social Networks")
              :place_lon [:Lng ->float]
              :place_lat [:Lat ->float]})
