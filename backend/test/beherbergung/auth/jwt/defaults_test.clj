(ns beherbergung.auth.jwt.defaults-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [beherbergung.auth.jwt.defaults :refer [sign unsign default_validity:seconds]]
            [beherbergung.auth.jwt.state :refer [secret]]
            [buddy.sign.jwt]
            [buddy.sign.util :refer [now]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest sign+unsign_ok
  (let [jwt (sign {:userid 42})]
       (is (= 42 (:userid (unsign jwt))))))

(deftest sign+unsign_expired
  (let [jwt (sign {:userid 42})]
       (is (thrown-with-msg? clojure.lang.ExceptionInfo #"Token is expired"
                             (buddy.sign.jwt/unsign jwt secret {:now (+ (now) default_validity:seconds)})))))

(deftest sign_too_short_secret
  (mount/start-with {#'secret "insecure"})
  (is (thrown-with-msg? java.lang.Exception #"Secret too short"
                        (sign {:userid 42}))))

