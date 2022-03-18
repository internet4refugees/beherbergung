(ns beherbergung.model.columns
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::name t/string)
(s/def ::type t/string)
(s/def ::header t/string)

(s/def ::group (s/nilable t/string))
(s/def ::defaultWidth (s/nilable t/int))
(s/def ::editable (s/nilable t/boolean))


;; options.filter

(s/def ::operator (s/nilable t/string))
(t/defobject Filter {:name "Filter" :kind t/object-kind #_#_:description ""}
            :opt-un [::operator])
(s/def ::filter (s/nilable Filter))


;; options.transform

(s/def ::inputDateFormat (s/nilable t/string))
(t/defobject Date2Iso {:name "Date2Iso" :kind t/object-kind #_#_:description ""}
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

(s/def ::dateFormat (s/nilable t/string))


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
