(ns beherbergung.auth.uuid.core)

(defn uuid
  "Using version 4 (random) UUIDs, we avoid exposing the creation date of database records."
  []
  (str (java.util.UUID/randomUUID)))
