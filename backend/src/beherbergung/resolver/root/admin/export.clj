(ns beherbergung.resolver.root.admin.export
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [beherbergung.model.login :as login]
            [beherbergung.model.export :as export]
            [beherbergung.auth.admin :refer [admin?]]
            [beherbergung.db.export :refer [all_docs edn->pprint]]
            [beherbergung.security.encryption.gpg :refer [encrypt]]
            [beherbergung.config.state :refer [env]]))

(s/fdef export
        :args (s/tuple map? (s/keys :req-un [::login/password]) map? map?)
        :ret (s/nilable ::export/result))

(defn export
  "Export an encrypted database dump"
  [_node opt ctx _info]
  (when (admin? (:password opt))
        (-> (all_docs (:db_ctx ctx))
            (edn->pprint)
            (encrypt (:admin-gpg-id env)))))

(s/def ::export (t/resolver #'export))
