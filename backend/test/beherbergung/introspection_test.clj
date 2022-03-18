(ns beherbergung.introspection-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest introspection
  (is (= (->> (-> (graphql {:query "{__schema{types{name}}}"})
                  (get-in [:data :__schema :types]))
              (map :name)
              sort)
         '("Auth" "Boolean" "Float" "ID" "Int" "Long" "MutationType" "OnEditCompleteByType" "QueryType" "String" "export" "get_offers" "get_rw" "login"))))
