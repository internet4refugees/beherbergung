(ns data.table.writer
  (:require [dk.ative.docjure.spreadsheet :as xls]
            [semantic-csv.core :as sc]
            [clojure.spec.alpha :as s]
            [clojure.string :refer [ends-with?]]))

;; TODO check that cells are literals, not compounds
(s/def ::table-map (s/coll-of map?))
(s/def ::table-vec (s/coll-of vector?))
(s/def ::table (s/or :map ::table-map
                       :vec ::table-vec))

(defn vectorize-if-needed [table]
  (assert (s/valid? ::table table))
  (if (s/valid? ::table-map table)
      (sc/vectorize table)
      table))

(defn table2xls [filename args table]
  (let [workbook-name (:workbook-name args filename)
        wb (xls/create-workbook workbook-name (vectorize-if-needed table))]
       (xls/save-workbook! filename wb)))

(defn save-table!
 ([filename table]
  (save-table! filename {} table))
 ([filename args table]
  (assert (or (ends-with? filename ".xlsx")
              (ends-with? filename ".csv")))
  (if (ends-with? filename ".xlsx")
      (table2xls filename args table)
      (let [args+defaults (merge {:writer-opts {:delimiter ";"}} args)] 
           (sc/spit-csv filename args+defaults table)))
  (println "Saved " filename)))
