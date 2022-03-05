(ns mbox-parser.core
  "https://github.com/diavoletto76/mbox-parser/blob/master/src/mbox_parser/core.clj")

(defn- mbox-separator?
  "As per RFC 4155 (https://tools.ietf.org/html/rfc4155) Mbox separator is
  a sequence of empty line + line containing \"From <email> <timestamp>\""

  ;; TODO Enhance regexp to better match line2
  [line1 line2]
  (and (empty? line1)
       (boolean (re-matches #"^From .*" line2))))


(defn parse-lines
  "Given line-seq returns a lazy seq of messages. Messages are
  represented as a lazy sequence of lines."
  [lines]
  (let [fixed-lines (cons "" lines)]
    (->> (map list fixed-lines (rest fixed-lines))
         (partition-by (fn [[a b]] (mbox-separator? a b)))
         (filter (fn [[[a b]]] ((complement mbox-separator?) a b)))
         (map #(map first %))
         (map rest))))


(defn parse-reader
  "Given the BufferedReader of mbox returns a lazy seq of messages
  contained in mbox itself. Messages are represented as lazy sequence of lines"
  [reader]
  (->> (line-seq reader)
       (parse-lines)))
