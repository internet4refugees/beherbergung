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
