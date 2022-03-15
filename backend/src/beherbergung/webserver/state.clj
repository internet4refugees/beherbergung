(ns beherbergung.webserver.state
  (:gen-class)  ;; this Class contains our -main function
  (:require [ring.adapter.jetty]
            [ring.middleware.reload]
            [beherbergung.webserver.handler]
            [beherbergung.db.import.offer.lifeline :refer [import!]]
            [mount.core :as mount :refer [defstate]]
            [beherbergung.config.state]
            [signal.handler :refer [with-handler]]))

(defstate ^{:on-reload :noop}  ;; When the app is recompiled, mount should not care, but we use ring.middleware.reload/wrap-reload
  webserver
  :start (do (println (str "Start server at http://localhost:" (:port beherbergung.config.state/env)))
             (ring.adapter.jetty/run-jetty (ring.middleware.reload/wrap-reload #'beherbergung.webserver.handler/app)
                                           {:port (:port beherbergung.config.state/env) :join? false}))
  :stop (.stop webserver))

(defn -main [& _args]
  (mount/start)

  (import!)  ;; This is not the seeding, but import from external formats

  (let [finaly (fn [] (mount/stop)  ;; Export the database
                      (System/exit 0))]
       (with-handler :term (finaly))  ;; kill
       (with-handler :int (finaly)))  ;; Ctrl+C

  (mount.core/running-states))  ;; Return value for debugging when called on repl
