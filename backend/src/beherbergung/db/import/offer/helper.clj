(ns beherbergung.db.import.offer.helper
  (:require [beherbergung.db.state :refer [db_ctx]]
            [clj-http.client :as http-client]
            [beherbergung.auth.uuid.core :refer [uuid]]
            [beherbergung.model.offer :as offer]
            [beherbergung.model.ngo :as ngo]))

(defn geocode
  "Add coordinates to an ::offer/record if not already existing"
  [record]
  (if (and (:place_lon record) (:place_lat record))
      record
      (let [params (cond (not-empty (:place_city record))
                           {:city (:place_city record)}
                         (not-empty (:place_str record))
                           {:q (:place_str record)})
            result (when params
                         (prn params)
                         (http-client/get "https://nominatim.openstreetmap.org/search?format=json&limit=1"
                                     {:accept :json :as :json :query-params params}))
            result_ok (when (= 200 (:status result))
                            (first (:body result)))]
            (println (or (:display_name result_ok)
                         result))
            (assoc record
                   :place_lon (:lon result_ok)
                   :place_lat (:lat result_ok)))))

(defn update-offers [ngo:id table]
  (let [{:keys [tx-fn-put tx-fn-call]} db_ctx]
       (tx-fn-put :update-offer
                  '(fn [ctx eid doc ngo:id]
                       (let [db (xtdb.api/db ctx)
                             entity (xtdb.api/entity db eid)]
                            [[:xtdb.api/put (assoc (merge entity doc)
                                                   :xt/id eid
                                                   :xt/spec ::offer/record
                                                   ::ngo/id ngo:id)]])))
       (doseq [record table
               :let [existingId (when (:id_tmp record)
                                      (str "offer_" (:id_tmp record)))]]
              ;; TODO: skip geocoding when it was already successfully done at an earlier import
              (tx-fn-call :update-offer (or existingId (uuid))
                                        (geocode record)
                                        ngo:id))))
