(ns beherbergung.resolver.login-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.resolver.core :refer [graphql]]
            [beherbergung.auth.jwt.login :refer [jwt->id]]))

(def mail "max.mueller@warhelp.eu")
(def password "18;%+ZW^|tST_lJ(k9P[")

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest correct-login
  (let [response (graphql {:query "query x($auth: Auth) { login(auth: $auth){ jwt } }"
                           :variables {:auth {:mail mail :password password}}})
        jwt (get-in response [:data :login :jwt])]
       (is (string? jwt))
       (is (= "login_max_mueller" (jwt->id jwt)))))

(deftest wrong-login
  (let [response (graphql {:query "query x($auth: Auth) { login(auth: $auth){ jwt } }"
                           :variables {:auth {:mail mail :password "wrong"}}})
        jwt (get-in response [:data :login :jwt])]
       (is (nil? jwt))))
