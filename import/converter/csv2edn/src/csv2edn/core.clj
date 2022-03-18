(ns csv2edn.core
  (:require [clojure.java.io :as io]
            [clojure-csv.core :as csv]
            [semantic-csv.core :as sc]
            [clojure.pprint :refer [pprint]])
  (:gen-class))

(defn -main
 ([]
  (-main "/dev/stdin"))
 ([csv-file & _args]
  (->> (io/reader csv-file)
       (csv/parse-csv)
       (sc/mappify {:keyify false})
       (into [])
       (pprint))))

