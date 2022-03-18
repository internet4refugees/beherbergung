(defproject beherbergung-backend "0.0.1"
  :description "beherbergung (private hosting of refugees) backend"
  :min-lein-version "2.0.0"
  :dependencies [;; core
                 [org.clojure/clojure "1.10.3"]
                 [yogthos/config "1.2.0"]
                 [mount "0.1.16"]
                 [spootnik/signal "0.2.4"]
                 ;; db
                 [com.xtdb/xtdb-core "1.20.0"]
                 [com.xtdb/xtdb-rocksdb "1.20.0"]
                 ;; graphql + http
                 [org.clojars.johannesloetzsch/specialist-server "0.7.0" :exclusions [com.ibm.icu/icu4j]]
                 [compojure "1.6.2"]
                 [ring/ring-core "1.9.5"]
                 [ring/ring-jetty-adapter "1.9.5"]
                 [ring/ring-devel "1.9.5"]
                 [ring-cors "0.1.13"]
                 [ring/ring-json "0.5.1" :exclusions [cheshire]]
                   [cheshire "5.10.2"]
                 [ring-json-response "0.2.0"]
                 [co.deps/ring-etag-middleware "0.2.1"]
                 ;; auth + mail
                 [cryptohash-clj "0.1.10"]
                 [likid_geimfari/secrets "1.1.1"]
                 [crypto-random "1.2.1"]
                 [buddy/buddy-sign "3.4.333"]
                 #_[com.draines/postal "2.0.4"]
                 ;; ajax (geocoding)
                 [clj-http "3.12.3"]
                 ;; logging
                 [org.clojure/tools.logging "1.2.4"]
                 [org.slf4j/slf4j-api "2.0.0-alpha6"]
                 [org.slf4j/slf4j-simple "2.0.0-alpha6"]
                 ;; testing
                 [org.clojure/test.check "0.9.0"]
                ]
  :main beherbergung.webserver.state
  :profiles {:dev {:dependencies [;; helpers for testing
                                  [javax.servlet/servlet-api "2.5"]
                                  [ring/ring-mock "0.4.0"]
                                  ;; additional deps to run `lein test` 
                                  [nrepl/nrepl "0.9.0"]
                                  [clojure-complete/clojure-complete "0.2.5"]]
                   #_#_:jvm-opts ["-Dverbose=true"]}
             :test {:jvm-opts ["-Ddb-inmemory=true" "-Ddb-export-prefix="]}
             :uberjar {:aot :all}}
  :jvm-opts ["-Dclojure.tools.logging.factory=clojure.tools.logging.impl/slf4j-factory"  ;; used by yogthos/config and com.xtdb/xtdb-core
             "-Dorg.slf4j.simpleLogger.defaultLogLevel=warn"  ;; usded by jetty (via ring/ring-jetty-adapter)
             "-Dlog4j2.formatMsgNoLookups=true"])  ;; not required, since log4j is no runtime dependency, but for defense-in-depth
