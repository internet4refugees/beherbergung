{beherbergung-backend}: {
  config,
  pkgs,
  lib,
  ...
}: let
  config-edn = pkgs.writeText "config.edn" ''
     {
       :frontend-base-url "http://localhost:4000"
       :frontend-backend-base-url "http://localhost:4000"

       :port 4000

       :jwt-secret nil

       :verbose false

       :validate-output true

       :db-inmemory false
       :db-dir "/var/lib/beherbergung-backend/xtdb/rocksdb"
       :db-seed nil #_"${pkgs.writeText "seed.edn" ''[]''}"
       :db-export-prefix "/var/lib/beherbergung-backend/data/export/"
       :db-validate true

       :import-ngo "warhelp"
       :import-file nil #_"${pkgs.writeText "example.edn" ''[]''}"
       :import-limit nil

       ;:mail-host ""
       ;:mail-user ""
       ;:mail-pass ""
       ;:mail-port 587
       ;:mail-from nil

       :admin-passphrase nil
       :admin-gpg-id "9EA68B7F21204979645182E4287B083353C3241C"
    }
  '';
in {
  options.it4r.beherbergung-backend.settings = lib.mkOption {
    default = {};
    description = ''
      See https://github.com/internet4refugees/beherbergung/tree/main/backend#configuration
    '';
    example = {
      CONFIG_MAIL_PASS = "secret";
    };
    type = lib.types.attrsOf lib.types.str;
  };
  config = {
    it4r.beherbergung-backend.settings = {
      MALLOC_ARENA_MAX = lib.mkDefault "2";
      JAVA_TOOL_OPTIONS = lib.mkDefault "-Dclojure.tools.logging.factory=clojure.tools.logging.impl/slf4j-factory -Dorg.slf4j.simpleLogger.defaultLogLevel=warn -Dlog4j2.formatMsgNoLookups=true";
    };

    systemd.services.beherbergung-backend = {
      wantedBy = ["multi-user.target"];
      serviceConfig = {
        DynamicUser = true;
        User = "beherbergung-backend";
        Environment =
          [
            "CONFIG=${config-edn}"
          ]
          ++ (lib.mapAttrsToList (name: value: "${name}=${toString value}") config.it4r.beherbergung-backend.settings);
        StateDirectory = "beherbergung-backend";
        WorkingDirectory = "/var/lib/beherbergung-backend";
        ExecStart = "${pkgs.jre}/bin/java -jar ${beherbergung-backend.jar}/beherbergung-backend-standalone.jar";
      };
    };
  };
}
