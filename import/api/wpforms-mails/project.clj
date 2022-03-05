(defproject wpforms-mails "0.1.0-SNAPSHOT"
  :description "Parse mails with datasets from WPForms"
  :url "https://mission-lifeline.de/unterkunft-bereitstellen"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [yogthos/config "1.2.0"]
                 [io.forward/clojure-mail "1.0.8"]
                 [clj-tagsoup "0.3.0" :exclusions [org.clojure/clojure org.clojure/data.xml]]
                 [org.clojure/data.xml "0.0.8"]
                 [dk.ative/docjure "1.14.0"]]
  :main ^:skip-aot wpforms-mails.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all
                       :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}})
