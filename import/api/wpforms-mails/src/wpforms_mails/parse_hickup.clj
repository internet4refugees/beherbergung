(ns wpforms-mails.parse-hickup)

(defn filter_expr->filter_fn [filter_expr]
 (cond
   (keyword? filter_expr)
     #(= filter_expr (first %))
   (fn? filter_expr)
     filter_expr))

(defn children 
 ([h]
  (filter #(not (map? %)) (rest h)))
 ([filter_expr h]
  (let [filter_fn (filter_expr->filter_fn filter_expr)]
       (filter filter_fn (children h)))))

(defn child [& args]
  (first (apply children args)))

(defn node? [hh]
  (keyword? (first hh)))

(defn pp
  "pretty print"
  [hh]
  (if (node? hh)
      [(first hh) (->> (map first (children hh))
                       (into []))]
      ;; multiple nodes
      (map first hh)))

(defn wpforms_input->map [input_table]
  (let [rows (->> input_table
                  (child :tbody)
                  (children :tr)
                  (map #(child :td %))
                  (map child))
        [k_strong v] rows
        k (child k_strong)]
       {k v}))

(defn wpforms_html->edn [html]
  (-> (->> html
           (child :body)
           (child :center)
           (child :table)
           (child :tr)
           (child :td)
           (child :table)
           (children :tr) first
           (child :td)
           (child :table)
           (child :tbody)
           (child :tr)
           (child :td)
           (child :table)
           (child :tbody)
           (child :tr)
           (child :td)
           children
           (map wpforms_input->map)
           (apply merge))
      (update "E-Mail" #(child string? %))))
