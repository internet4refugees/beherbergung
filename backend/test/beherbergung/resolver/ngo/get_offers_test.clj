(ns beherbergung.resolver.ngo.get-offers-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]))

(def mail "praxis@max.mueller.de")
(def password "i!A;z\\\"'^G3Q)w])%83)")

(defn get_offers [variables]
  (let [response (graphql {:query "query x($auth: Auth) { get_offers(auth: $auth){ accessible note } }"
                           :variables variables})]
        (get-in response [:data :get_offers])))


(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest correct-login
  (let [offers (get_offers {:auth {:mail mail :password password}})]
       (is (= 10 (count offers)))  ;; 10 is the default sample size of gen/sample
       (is (= {:accessible true, :note "hkUGJ8"}
              (nth offers 7)))))  ;; picked one of the random generated datasets that contains not so many trivial values

(deftest wrong-login
  (let [offers (get_offers {:auth {:mail mail :password "wrong"}})]
       (is (nil? offers))))
