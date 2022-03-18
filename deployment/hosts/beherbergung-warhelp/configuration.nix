{
  config,
  pkgs,
  modulesPath,
  ...
}: {
  system.stateVersion = "21.11";

  networking.hostName = "beherbergung-warhelp";

  ## The next part is copied from https://github.com/Mic92/dotfiles/commit/be6b898e8fbd12716cce380d8f3889a926003990

  imports = [
    "${toString modulesPath}/virtualisation/lxc-container.nix"
  ];
  services.openssh = {
    enable = true;
    passwordAuthentication = false;
    useDns = false;
  };
  systemd.network.enable = true;
  networking.useDHCP = false;
  networking.useHostResolvConf = false;

  # allow nginx of the host to access frontend and backend
  networking.firewall.extraCommands = ''
    ip6tables -I nixos-fw -p tcp -s 2a01:4f8:10b:49f::/64 -m multiport --dports 3000,4000 -j nixos-fw-accept
  '';

  systemd.network.networks."50-container-host0.network".extraConfig = ''
    [Match]
    Virtualization = container
    Name = host0
    [Network]
    # increment this for new servers...
    Address = 2a01:4f8:10b:49f:1::1/80
    # ... and this
    Address = 192.168.21.1/24
    Gateway = 192.168.21.254
    LinkLocalAddressing = yes
    LLDP = yes
    EmitLLDP = customer-bridge
    IPv6AcceptRA = yes
    [DHCP]
    UseTimezone = yes
  '';

  users.users.root.openssh.authorizedKeys.keys = [
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKbBp2dH2X3dcU1zh+xW3ZsdYROKpJd3n13ssOP092qE joerg@turingmachine"
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDW+YfsFtRz1h/0ubcKU+LyGfxH505yUkbWa5VtRFNWF2fjTAYGj6o5M4dt+fv1h370HXvvOBtt8sIlWQgMsD10+9mvjdXWhTcpnYPx4yWuyEERE1/1BhItrog6XJKAedbCDpQQ+POoewouiHWVAUfFByPj5RXuE8zKUeIEkGev/QKrKTLnTcS8zFs/yrokf1qYYR571B3U8IPDjpV/Y1GieG3MSNaefIMCwAAup1gPkUA0XZ4A1L7NdEiUEHlceKVu9eYiWUM+wDRunBXnLHubeGyP8KmBA7PNKgml3WWRNTZjqNQk4u9Bl+Qea5eCkD8KI257EqgXYXy0QBWNyF8X j03@l302"
  ];

  ## Service specific configuration

  users.users."beherbergung" = {
    group = "beherbergung";
    isSystemUser = true;
    createHome = true;
    home = "/var/lib/beherbergung";
    openssh.authorizedKeys.keys = config.users.users.root.openssh.authorizedKeys.keys;
    shell = "${pkgs.bash}/bin/bash";
  };
  users.groups."beherbergung" = {};
}
