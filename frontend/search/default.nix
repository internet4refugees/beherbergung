{ yarn2nix-moretea }:
yarn2nix-moretea.mkYarnPackage {
  pname = "yarn-node-modules";
  src = ./.;
  yarnLock = ./yarn.lock;
  packageJSON = ./package.json;
}
