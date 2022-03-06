(ns beherbergung.auth.password.generate
  (:require [secrets.core :refer [choices]]
            [secrets.constants :refer [ascii-letters digits punctuation]]
            [clojure.string :refer [join]]))

(defn generate-password []
  (let [length 20
        characters (str ascii-letters digits punctuation)]
       (->> (choices characters length)
            (join ""))))
