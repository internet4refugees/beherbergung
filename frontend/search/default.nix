{yarn2nix-moretea}:
yarn2nix-moretea.mkYarnPackage {
  pname = "yarn-node-modules";
  src = ./.;
  yarnLock = ./yarn.lock;
  # slow
  dontStrip = true;
  buildPhase = ''
    yarn --offline build
  '';
}
