{pkgs, ...}: {
  boot.cleanTmpDir = true;

  nix.package = pkgs.nixUnstable;
  nix.extraOptions = "experimental-features = nix-command flakes";

  #nix.daemonIONiceLevel = 7;
  #nix.daemonNiceLevel = 19;

  nix.autoOptimiseStore = true;
  nix.gc = {
    automatic = true;
    dates = "weekly";
  };
}
