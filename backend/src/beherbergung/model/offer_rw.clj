(ns beherbergung.model.offer-rw
  (:require [clojure.spec.alpha :as s]
            [beherbergung.model.offer :as offer]))

(s/def ::record ::offer/offer-rw)
