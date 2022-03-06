(ns lib.resources.list-resources
  (:require [clojure.java.io :as io]
            [clojure.string :as s]
            [clojure.set :refer [subset?]]))

(def ^:private running-jar 
  (-> :keyword class (.. getProtectionDomain getCodeSource getLocation getPath)))

(defn list-jar-resources [prefix]
  (let [jar (java.util.jar.JarFile. running-jar)
        entries (.entries jar)
        entries-rec (loop [result []]
                          (if (.hasMoreElements entries)
                              (recur (conj result (.. entries nextElement getName)))
                              result))]
       (->> entries-rec
            (filter #(s/starts-with? % prefix))
            (drop 1)
            (map #(s/replace % prefix "")))))

(defn getPath [f]
  (when f (.getPath f)))

(defn list-dev-resources [prefix]
  (let [root-path (getPath (io/resource prefix))]
       (some->> (io/file (io/resource prefix))
                file-seq
                (drop 1)
                (map #(if (.isDirectory %)
                          (str (getPath %) "/")
                          (getPath %)))
                (map #(s/replace % root-path "")))))

(defn list-resources [prefix]
  (try (list-dev-resources prefix)
       (catch java.lang.IllegalArgumentException _
              (list-jar-resources prefix))))

(defn selftest []
  (and (subset? #{"/graphiql/" "/graphiql/index.html"} (set (list-resources "public")))
       (subset? #{"graphiql/" "graphiql/index.html"} (set (list-resources "public/")))))
