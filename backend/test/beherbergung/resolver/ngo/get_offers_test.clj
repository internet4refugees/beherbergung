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
       (is (= 110 (count offers)))  ;; TODO: we need a test dataset that can be published (generated)
       (is (= {:accessible true
               :note "füg"}
              (first offers)))))

(deftest wrong-login
  (let [offers (get_offers {:auth {:mail mail :password "wrong"}})]
       (is (nil? offers))))
