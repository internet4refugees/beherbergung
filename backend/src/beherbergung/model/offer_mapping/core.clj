(ns beherbergung.model.offer-mapping.core)

(defn unify
  [offers mapping]
  (let [mapping->fn (fn [mapping]
                        (fn [dataset] (->> mapping
                                           (map (fn [[k v]]
                                                    [k (cond (fn? v)
                                                               (v dataset)
                                                             (vector? v)
                                                               (let [[orig_kw parse_fn] v]
                                                                    (parse_fn (get dataset orig_kw)))
                                                             :else
                                                               (get dataset v))]))
                                           (into {}))))]
       (map (mapping->fn mapping) offers)))

(defn grouping [rows]
  (let [grouped (vals (group-by :id_tmp rows))
        grouped-sorted (for [group grouped]
                            (->> group
                                 (map #(assoc % :submission_count (count group)))
                                 #_(sort-by :time_submission_str)))]
       ;; show only latest
       (map last grouped-sorted)
       ;; show all
       #_
       (->> (apply concat grouped-sorted)
            (map #(assoc % :id_tmp (str (:id_tmp %) (when (> (:submission_count %) 1)
                                                          (:time_submission_str %))))))))
