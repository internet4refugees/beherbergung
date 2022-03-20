(ns beherbergung.model.columns
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

;; Column definitions directly delivered to reactdatagrid.io
;; See: https://reactdatagrid.io/docs/getting-started#defining-columns
;;      https://reactdatagrid.io/docs/api-reference#props-columns

(s/def ::name (t/field t/string "The identifier of the column"))
(s/def ::type (t/field t/string "The type, deliverd to reactdatagrid (after transformation)"))
(s/def ::header (t/field t/string "The displayed name of the column (before translation)"))

(s/def ::group (s/nilable t/string))
(s/def ::defaultWidth (s/nilable t/int))
(s/def ::editable (s/nilable t/boolean))



;; Additional definitions transformed by ./frontend/search/components/ngo/DeclarativeDataGrid.tsx


;; options.filter

(s/def ::operator (s/nilable t/string))
(t/defobject Filter {:name "Filter" :kind t/object-kind
                     :description "option that influences the default filter option for a column"}
            :opt-un [::operator])
(s/def ::filter (s/nilable Filter))


;; options.transform

(s/def ::inputDateFormat (s/nilable t/string))
(t/defobject Date2Iso {:name "Date2Iso" :kind t/object-kind :description "convert a string date to iso format or other string formats"}
            :opt-un [::inputDateFormat])
(s/def ::date2Iso (s/nilable Date2Iso))

(s/def ::join (s/nilable t/string))
(t/defobject Array2string {:name "Array2string" :kind t/object-kind #_#_:description ""}
            :opt-un [::join])
(s/def ::array2string (s/nilable Array2string))

(t/defobject Transform {:name "Transform" :kind t/object-kind #_#_:description ""}
            :opt-un [::date2Iso
                     ::array2string])
(s/def ::transform (s/nilable Transform))


;; options.dateFormat

(s/def ::dateFormat (t/field (s/nilable t/string) "needed  for date-strings, in order to make filter understand what date format the date string has"))


;; options

(t/defobject Options {:name "Options" :kind t/object-kind #_#_:description ""}
            :opt-un [::filter
                     ::transform
                     ::dateFormat])
(s/def ::options (s/nilable Options))

(s/def ::columns (s/keys :req-un [::name ::type ::header]
                         :opt-un [::group
                                  ::defaultWidth
                                  ::editable
                                  ::options]))


(defn ->graphql [data]  ;; TODO
  (-> data
      (update :group identity)
      (update :defaultWidth identity)
      (update :editable identity)
      (update :options (fn [o] (-> o
                                   (update :filter identity)
                                   (update :transform (fn [t] (-> t
                                                                  (update :date2Iso (fn [d] (-> d
                                                                                                (update :inputDateFormat identity))))
                                                                  (update :array2string (fn [a] (-> a
                                                                                                    (update :join identity)))))))
                                   (update :dateFormat identity))))))
