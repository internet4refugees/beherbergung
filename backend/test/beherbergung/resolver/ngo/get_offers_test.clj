(ns beherbergung.resolver.ngo.get-offers-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]))

(def mail "praxis@max.mueller.de")
(def password "i!A;z\\\"'^G3Q)w])%83)")

(defn get_offers [variables]
  (let [response (graphql {:query "query x($auth: Auth) { get_offers(auth: $auth){ time_from_str time_duration_str beds languages place_country place_city place_zip place_street place_street_number accessible animals_allowed animals_present contact_name_full contact_phone contact_email note } }"
                           :variables variables})]
        (get-in response [:data :get_offers])))


(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest correct-login
  (let [offers (get_offers {:auth {:mail mail :password password}})]
       (is (= 10 (count offers)))  ;; 10 is the default sample size of gen/sample
       (is (=  {:beds 27
                :place_street "wIbUsu"
                :contact_email "x0Vl9"
                :contact_name_full "48"
                :time_duration_str "33"
                :note "Z"
                :place_street_number "VB3"
                :place_city "f"
                :contact_phone "sQdB"
                :place_zip "cid1"
                :time_from_str "03/05/2022"
                :place_country "toTz5B"
                :animals_present false
                :languages '("vMR0zyECr")
                :accessible false
                :animals_allowed false}
              (last offers)))))  ;; the later random generated datasets contain less trivial values

(deftest wrong-login
  (let [offers (get_offers {:auth {:mail mail :password "wrong"}})]
       (is (nil? offers))))
