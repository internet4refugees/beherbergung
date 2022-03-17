{ yarn2nix-moretea, glibcLocales, stdenv, yarn }:
let
  beherbergung-frontend-deps = yarn2nix-moretea.mkYarnPackage {
    pname = "beherbergungs-frontend-deps";
    src = ./.;
    yarnLock = ./yarn.lock;
    # slow
    dontStrip = true;
  };
in {
  inherit beherbergung-frontend-deps;
  beherbergung-frontend-assets = stdenv.mkDerivation {
    name = "beherbergung-frontend-assets";
    src = ./.;
    buildInputs = [
      yarn
    ];
    # https://nextjs.org/telemetry
    NEXT_TELEMETRY_DISABLED = "1";
    buildPhase = ''
      runHook preBuild
      node_modules=${beherbergung-frontend-deps}/libexec/beherbergung/node_modules
      ${yarn2nix-moretea.linkNodeModulesHook}
      HOME=$TMPDIR yarn --offline build
      runHook postBuild
    '';
    doCheck = true;
    checkPhase = ''
      runHook preCheck
      HOME=$TMPDIR yarn --offline lint
      runHook postCheck
    '';
    installPhase = ''
      runHook preInstall
      cp -r .next $out
      runHook postInstall
    '';
  };
}
