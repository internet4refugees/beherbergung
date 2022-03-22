(ns lib.time  ;; for now no additional dependency is required
  (:import java.text.SimpleDateFormat
           java.util.Calendar))

(defn get-current-iso-8601-date
  "Returns current ISO 8601 compliant date."
  []
  (.format (SimpleDateFormat. "yyyy-MM-dd'T'HH:mm:ssZ")
           (.getTime (Calendar/getInstance))))
