(ns beherbergung.db.import.offer.ngo.public.icanhelp
  (:require [clj-http.client :as http-client]
            [beherbergung.model.offer-mapping.core :refer [unify]]
            [beherbergung.model.offer-mapping.icanhost]))

(defn api->table []
  (let [result (http-client/get "https://icanhelp.host/api/supporters"
                                {:accept :json :as :json #_#_:query-params params})
        result_ok (when (= 200 (:status result))
                        (:result (:body result)))]
        (println (or (str (count result_ok) " datasets downloaded")
                     result))
        ;(->> result_ok (map keys) (apply concat) (into #{}) println)
        (unify result_ok
               beherbergung.model.offer-mapping.icanhost/mapping)))
