(ns beherbergung.resolver.ngo.rw-test
  (:require [clojure.test :refer [use-fixtures deftest is testing]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]))

(def mail "max.mueller@warhelp.eu")
(def password "18;%+ZW^|tST_lJ(k9P[")

(def sample-data1 {:rowId "idOfRow" :columnId "note" :value_string "hello from testcase" :value_boolean nil})
(def sample-data2 {:rowId "idOfRow" :columnId "animals_allowed" :value_string nil :value_boolean true})

(defn get_rw [variables]
  (let [response (graphql {:query "query x($auth: Auth) { get_rw(auth: $auth){ note animals_allowed } }"
                           :variables variables})]
        (get-in response [:data :get_rw])))

(defn write_rw [variables]
  (let [response (graphql {:query "mutation x($auth: Auth!, $onEditCompleteByType: OnEditCompleteByType) {
                                    write_rw(auth: $auth, onEditCompleteByType: $onEditCompleteByType) }"
                           :variables variables})]
        (get-in response [:data :get_rw])))


(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest wrong-login
  (let [rw_data (get_rw {:auth {:mail mail :password "wrong"}})]
       (is (= nil rw_data))))

(deftest correct-login
  (testing "get_rw initially returns 0 rows"
    (is [] (get_rw {:auth {:mail mail :password password}})))
  (testing "get_rw returns the result set by write_rw"
    (write_rw {:auth {:mail mail :password password}
               :onEditCompleteByType sample-data1})
    (is (= [{:note "hello from testcase" :animals_allowed nil}]
           (get_rw {:auth {:mail mail :password password}}))))
  (testing "get_rw returns the merged result after second write_rw"
    (write_rw {:auth {:mail mail :password password}
               :onEditCompleteByType sample-data2})
    (is (= [{:note "hello from testcase" :animals_allowed true}]
           (get_rw {:auth {:mail mail :password password}})))))
