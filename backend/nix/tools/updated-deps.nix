{
  pkgs,
  mvn2nix,
}:
pkgs.writeScriptBin "backendUpdatedDeps" ''
  #!${pkgs.runtimeShell} -e

  cd backend
  ${pkgs.leiningen}/bin/lein pom
  echo 'Call `lein pom` yourself and than add explicitly add maven-compiler-plugin in an up to date version'
  echo
  echo 'When you changed dependencies, you also want run nvd-check'
  echo

  echo "Generating mvn2nix-lock.json, please wait…"
  ${mvn2nix}/bin/mvn2nix --repositories https://clojars.org/repo https://repo.maven.apache.org/maven2 > "nix/deps/mvn2nix-lock.json"
''
