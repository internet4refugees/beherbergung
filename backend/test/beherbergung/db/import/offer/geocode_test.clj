(ns beherbergung.db.import.offer.geocode-test
  (:require [clojure.test :refer [deftest testing is]]
            [beherbergung.db.import.offer.helper :refer [geocode]]))

(defn close-to [expected result & [{:keys [accuracy] :or {accuracy 0.01}}]]
  (let [round (fn [f] (when f (* accuracy (Math/round (/ (Float/parseFloat f) accuracy)))))]
       (and (= (round (:place_lon expected)) (round (:place_lon result)))
            (= (round (:place_lat expected)) (round (:place_lat result))))))

(def dresden {:place_lon "13.7381437", :place_lat "51.0493286"})
(def dresden_01129 {:place_lon "13.73846258995878", :place_lat "51.0762895"})
(def dresden_01129_germany {:place_lon "13.718427122208208", :place_lat "51.09245947625934"})
(def wien {:place_lon "16.3725042" :place_lat "48.2083537"})
(def aspang_philippines {:place_lon "125.0476294", :place_lat "6.0325432"})
(def aspang_österreich {:place_lon "16.091602470349354" :place_lat "47.55210945"})

(deftest ^:remote geocode-test
  (testing "city"
    (is (close-to dresden
                  (geocode {:place_city "Dresden"})))
    (is (close-to wien
                  (geocode {:place_city "Wien"})))
    (is (close-to wien
                  (geocode {:place_city "Vienna"})))
    (is (close-to aspang_philippines
                  (geocode {:place_city "Aspang"}))))

  (testing "city+country"
    (is (close-to aspang_österreich
                  (geocode {:place_city "Aspang" :place_country "Österreich"}))))

  (testing "zip+city"
    (is (close-to dresden_01129
                  (geocode {:place_zip "01129" :place_city "Dresden"}))))

  (testing "zip+country"
    (is (close-to dresden_01129_germany  ;; well, nominatim returns another result then when giving the city!?
                  (geocode {:place_zip "01129" :place_country "Germany"})))))
