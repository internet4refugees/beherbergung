(ns data.edn.writer
  (:require [clojure.pprint :refer [pprint]]))

(defn edn->pprint [edn]
  (with-out-str (pprint edn)))

(defn write-edn [file edn]
  (->> (edn->pprint edn)
       (spit file)))
