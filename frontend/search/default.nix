{
  yarn2nix-moretea,
  glibcLocales,
  stdenv,
  yarn,
  writeScriptBin,
  runtimeShell,
  yarn2nix,
}: let
  beherbergung-frontend-deps = yarn2nix-moretea.mkYarnPackage {
    pname = "beherbergungs-frontend-deps";
    src = ./.;
    yarnLock = ./yarn.lock;
    # XXX: we cannot disable this yet because enabling import-from-derivation in flake.nix breaks in nix 2.5
    yarnNix = ./yarn.nix;
    # slow
    dontStrip = true;
  };
in {
  inherit beherbergung-frontend-deps;
  updateFrontendDeps = writeScriptBin "frontendUpdatedDeps" ''
    #!${runtimeShell} -xe

    cd frontend/search
    ${yarn2nix}/bin/yarn2nix > yarn.nix
  '';
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
      HOME=$TMPDIR yarn --offline export

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
      cp -r out $out
      runHook postInstall
    '';
  };
}
