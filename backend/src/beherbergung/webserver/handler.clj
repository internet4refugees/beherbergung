(ns beherbergung.webserver.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.util.response :refer [response]]
            [beherbergung.webserver.middleware :refer [wrap-graphql wrap-graphiql wrap-nextjs-frontend wrap-frontend-config wrap-defaults]]
            [beherbergung.resolver.core :refer [graphql]]
            [beherbergung.config.state :refer [env]]))

(def frontend-url (:frontend-base-url env))


(defroutes app-routes
  (GET "/" [] ;; When using a fullstack-build, this route is overwritten by `wrap-nextjs-frontend`
              (str "<p>The backend takes care of data storage and securing its access.<br/>"
                   "   It provides a <a href=\"/graphql\">Graphql-API Endpoint</a>.<br/>"
                   "   You may want explore the schema and send queries using <a href=\"/graphiql/index.html\">GraphiQL</a>."
                   "</p>"
                   "<p>This build doesn't include the frontend.<br/>"
                   "   You may want start it independently and open <a href=\"" frontend-url "\">" frontend-url "</a>.</br>"
                   "   Alternatively production builds including the frontend are available via nix."
                   "</p/>"))

  (GET "/health" [] "ok")

  (->
    (POST "/graphql" req
          (response (graphql (:body req))))
    wrap-graphql
    wrap-graphiql)

  (route/not-found "Not Found"))

(def app
  (-> app-routes

      (wrap-nextjs-frontend)
      (wrap-frontend-config)

      (wrap-defaults)))
