(ns beherbergung.auth.token.generate
  (:require [crypto.random :refer [base32]]))

(defn generate-token
  "A 8 character base32 string should be user friendly.
   It gives us an entropy of 40 Bit = 5 Byte.
  
   We never use it as cryptographic secret for encryption or signing or any other function that can be bruteforced locally by an attacker.
   The entrophy is therefore only relevant for the expected amount of requests to the server an attacker would need to try."
  []
  (base32 5))
