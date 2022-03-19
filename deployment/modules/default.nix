{pkgs, ...}: {
  time.timeZone = "Europe/Berlin";

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

  environment.variables = {EDITOR = "vim";};
}
