(ns beherbergung.resolver.ngo.get-offers-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]
            [beherbergung.db.import.offer.core :refer [import!]]))

(def mail "max.mueller@warhelp.eu")
(def password "18;%+ZW^|tST_lJ(k9P[")
(def test-import-limit 2)

(defn get_offers [variables]
  (let [response (graphql {:query "query x($auth: Auth) { get_offers(auth: $auth){ time_from_str time_duration_str beds languages place_country place_city place_zip place_street place_street_number accessible animals_allowed animals_present contact_name_full contact_phone contact_email note } }"
                           :variables variables})]
        (get-in response [:data :get_offers])))


(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (import! test-import-limit) (testcases) (mount/stop)))

(deftest ^:remote correct-login
  (let [offers (get_offers {:auth {:mail mail :password password}})]
       (is (= test-import-limit (count offers)))
       (is (= {:beds 0
               :place_street ""
               :contact_email nil
               :contact_name_full ""
               :time_duration_str ""
               :note ""
               :place_street_number ""
               :place_city "Dresden"
               :contact_phone nil
               :place_zip ""
               :time_from_str "10/04/2022"
               :place_country "Deutschland"
               :animals_present false
               :languages '()
               :accessible false
               :animals_allowed false}
              (last offers)))))  ;; the later random generated datasets contain less trivial values

(deftest ^:remote wrong-login
  (let [offers (get_offers {:auth {:mail mail :password "wrong"}})]
       (is (nil? offers))))
