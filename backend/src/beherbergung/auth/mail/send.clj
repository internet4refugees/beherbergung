(ns beherbergung.auth.mail.send
  (:require ;[postal.core :refer [send-message]]
            [beherbergung.auth.mail.local.mailutils :refer [send-message]]
            [beherbergung.config.state :refer [env]]))

(defn send-mail [msg*]
  (let [server {:host (:mail-host env)
                :user (:mail-user env)
                :pass (:mail-pass env)
                :port (:mail-port env)
                :tls true}
        msg (assoc msg* :from (or (:mail-from env)
                                  (:mail-user-from env)))
        result (send-message server msg)]
       (or (= :SUCCESS (:error result))
           (= 0 (:exit result)))))
