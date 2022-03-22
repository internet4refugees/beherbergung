(ns beherbergung.config.state
  "Wrapping yogthos/config with defstate allows overwriting the config at runtime and checking it at startup against a spec"
  (:require [clojure.spec.alpha :as s]
            [mount.core :refer [defstate args]]
            [config.core]
            [clojure.string]))

(s/def ::frontend-base-url string?)
(s/def ::frontend-backend-base-url string?)
(s/def ::port number?)  ;; the webserver port
(s/def ::jwt-secret (s/nilable string?))

(s/def ::verbose boolean?)

(s/def ::validate-output boolean?)  ;; should specialist ensure type correctness

(s/def ::db-inmemory boolean?)  ;; we run unit tests in an in-memory instance, otherwise the default db would be looked
(s/def ::db-dir string?)  ;; ignored when ::db-inmemory
(s/def ::db-seed (s/nilable string?))  ;; an edn-file to be used for seeding
(s/def ::db-export-prefix (s/nilable string?))  ;; path where during startup an export should be written
(s/def ::db-validate boolean?)

(s/def ::admin-passphrase (s/nilable string?))  ;; allows setting up ngo logins and encrypted downloads of db exports
(s/def ::admin-gpg-id string?)

(s/def ::import-public boolean?)
(s/def ::import-ngo (s/nilable string?))
(s/def ::import-file (s/nilable string?))
(s/def ::import-limit (s/nilable number?))

(s/def ::mail-host string?)
(s/def ::mail-user string?)
(s/def ::mail-pass string?)
(s/def ::mail-port number?)
(s/def ::mail-from (s/nilable string?))

(s/def ::env (s/keys :req-un [::frontend-base-url
                              ::frontend-backend-base-url
                              ::port
                              ::jwt-secret
                              ::verbose
                              ::validate-output
                              ::db-inmemory ::db-dir
                              ::db-seed ::db-export-prefix
                              ::db-validate
                              ::admin-passphrase
                              ::admin-gpg-id
                              ::import-public
                              ::import-ngo
                              ::import-file
                              ::import-limit
                              ;::mail-host ::mail-user ::mail-pass ::mail-port ::mail-from
                             ]))

(defn strip-secrets [env]
  (assoc env :mail-pass "*"
             :admin-passphrase "*"
             :jwt-secret "*"))

(defn filter-defined [keys-spec m]
  (let [req-un (last (s/form keys-spec))
        unnamespaced-keys (map #(-> (clojure.string/replace %
                                                            (if-let [n (namespace %)]
                                                                    (str n "/")
                                                                    "")
                                                            "")
                                    (clojure.string/replace ":" "")
                                    keyword)
                               req-un)]
       (select-keys m (into [] unnamespaced-keys))))

(defstate env
  :start (let [env (->> (merge (config.core/load-env)
                               (args))  ;; allows: (mount/start-with-args {…})
                        (filter-defined ::env))
               config-errors (s/explain-data ::env env)]
              (when (:verbose env)
                    (println (strip-secrets env)))
              (assert (not config-errors) (with-out-str (s/explain-out config-errors)))
              env))
