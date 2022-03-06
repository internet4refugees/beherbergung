(ns data.table.writer
  (:require [dk.ative.docjure.spreadsheet :as xls]
            [semantic-csv.core :as sc]
            [data.edn.writer :refer [write-edn]]
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
  (cond
    (ends-with? filename ".xlsx")
      (table2xls filename args table)
    (ends-with? filename ".csv")
      (let [args+defaults (merge {:writer-opts {:delimiter ";"}} args)] 
           (sc/spit-csv filename args+defaults table))
    (ends-with? filename ".edn")
      (write-edn filename table)
    :else
      (assert false "Unsupported file extension!"))
  (println "Saved " filename)))
