(ns beherbergung.model.columns
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::name t/string)
(s/def ::type t/string)
(s/def ::header t/string)

(s/def ::group (s/nilable t/string))
(s/def ::defaultWidth (s/nilable t/int))
(s/def ::editable (s/nilable t/boolean))

(s/def ::columns (s/keys :req-un [::name ::type ::header]
                         :opt-un [::group
                                  ::defaultWidth
                                  ::editable]))

(defn ->graphql [data]
  (-> data
      (update :group identity)
      (update :defaultWidth identity)
      (update :editable identity)))
