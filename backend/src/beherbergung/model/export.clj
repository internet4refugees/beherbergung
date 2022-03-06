(ns beherbergung.model.export
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::exit t/int)

(s/def ::result (s/keys :req-un [::exit ::out ::err]))
