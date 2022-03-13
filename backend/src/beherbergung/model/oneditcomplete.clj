(ns beherbergung.model.oneditcomplete
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::rowId t/string)
(s/def ::columnId t/string)
(s/def ::value t/string)

(t/defobject OnEditComplete {:name "OnEditComplete" :kind t/input-object-kind :description "https://reactdatagrid.io/docs/api-reference#props-onEditComplete"}
             :req-un [::rowId ::columnId ::value])

(s/def ::onEditComplete OnEditComplete)
