(ns beherbergung.model.oneditcomplete
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::rowId t/string)
(s/def ::columnId t/string)
(s/def ::value_string (s/nilable t/string))
(s/def ::value_boolean (s/nilable t/boolean))

(t/defobject OnEditCompleteByType {:name "OnEditCompleteByType" :kind t/input-object-kind :description "https://reactdatagrid.io/docs/api-reference#props-onEditComplete"}
             :req-un [::rowId ::columnId
                      ::value_string ::value_boolean])

(s/def ::onEditCompleteByType OnEditCompleteByType)
