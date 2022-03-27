{pkgs, ...}: {
  boot.cleanTmpDir = true;

  nix.package = pkgs.nixUnstable;
  # TODO: in next release move all these to new `nix.settings.` option
  nix.extraOptions = ''
    experimental-features = nix-command flakes
    # Configure all the machines with ci's binary cache
    extra-trusted-public-keys = cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g=
    extra-substituters = "https://cache.garnix.io"
    # Avoid copying unecessary stuff over SSH
    builders-use-substitutes = true
    # If the user is in @wheel they are trusted by default
    trusted-users = [ "root" "@wheel" ];
  '';

  #nix.daemonIONiceLevel = 7;
  #nix.daemonNiceLevel = 19;

  nix.autoOptimiseStore = true;
  nix.gc = {
    automatic = true;
    dates = "weekly";
  };
}
