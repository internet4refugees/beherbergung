{
  pkgs,
  buildMavenRepositoryFromLockFile,
  patchPublic ? null,
}: let
  inherit (pkgs) lib stdenv jdk11_headless maven leiningen;
  inherit (stdenv) mkDerivation;

  mavenRepository = buildMavenRepositoryFromLockFile {file = ./deps/mvn2nix-lock.json;};

  src = mkDerivation {
    name = "beherbergung-backend-src";
    src = lib.cleanSource ./..;
    installPhase = ''
      cp -r . $out
    '';
  };

  version = "0.0.1";
  pname = "beherbergung-backend";
  name = "${pname}-${version}";

  beherbergung-backend-jar = mkDerivation rec {
    inherit src version pname name;

    buildInputs = [jdk11_headless maven leiningen mavenRepository];
    patchPhase =
      if isNull patchPublic
      then ""
      else "cp -r ${patchPublic}/* resources/public/";
    buildPhase = ''
      echo "Building with maven repository ${mavenRepository}"
      export HOME=`pwd`
      mkdir .lein
      echo '{:user {:offline? true :local-repo "${mavenRepository}"}}' > ~/.lein/profiles.clj
      lein uberjar
    '';
    doCheck = true;
    checkPhase = ''
      lein test :local
    '';

    installPhase = ''
      mkdir $out
      cp target/${name}-standalone.jar $out/${pname}-standalone.jar
    '';
  };
in
  lib.mergeAttrs
  (pkgs.writeScriptBin "${pname}" ''
    #!${pkgs.runtimeShell}

    ${pkgs.which}/bin/which mail || export PATH=./backend/resources/mock:$PATH

    ## TODO: JAVA_TOOL_OPTIONS should be generated from jvm-opts in project.clj and also update beherbergung.service
    export MALLOC_ARENA_MAX=2
    export JAVA_TOOL_OPTIONS='-Dclojure.tools.logging.factory=clojure.tools.logging.impl/slf4j-factory -Dorg.slf4j.simpleLogger.defaultLogLevel=warn -Dlog4j2.formatMsgNoLookups=true'
    ${jdk11_headless}/bin/java -jar ${beherbergung-backend-jar}/${pname}-standalone.jar $@
  '')
  {
    inherit mavenRepository;
    jar = beherbergung-backend-jar;
  }
