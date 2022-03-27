{
  pkgs,
  lib,
  ...
}: {
  imports = [
    ./nix.nix
  ];
  # UTC everywhere!
  time.timeZone = lib.mkDefault "UTC";

  # Speed-up the deployment by not generating the manuals
  documentation.enable = false;

  # Common server packages
  environment.systemPackages = with pkgs; [
    vim
    tmux
    wget
    curl
    htop
    atop
    iotop
    iftop
    file
    bc
    jq
    git
    gnupg
    bind.dnsutils
  ];

  # Use vim as the default editor
  environment.variables.EDITOR = "vim";

  # Print the URL instead
  environment.variables.BROWSER = "echo";

  # Use firewalls everywhere
  networking.firewall.enable = true;
  networking.firewall.allowPing = true;

  # Use sudo to gain privileged access
  security.sudo.enable = true;
  security.sudo.wheelNeedsPassword = false;

  # Enable the OpenSSH daemon
  services.openssh.enable = true;
  services.openssh.passwordAuthentication = false;

  # No need for sound on a server
  sound.enable = false;

  # Don't allow to change the users list
  users.mutableUsers = false;
}
