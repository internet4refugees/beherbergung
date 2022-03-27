{
  modulesPath,
  config,
  lib,
  ...
}: {
  options.it4r.lxc = {
    ipAddrs = lib.mkOption {
      description = ''
        ipv4/ipv6 addresses to assign to the container interface.
        The address also contain the cidr suffix.
      '';
      type = lib.types.listOf lib.types.str;
    };
  };
  ## The next part is adapted from https://github.com/Mic92/dotfiles/commit/be6b898e8fbd12716cce380d8f3889a926003990
  imports = [
    "${toString modulesPath}/virtualisation/lxc-container.nix"
  ];
  config = {
    services.openssh = {
      enable = true;
      passwordAuthentication = false;
      useDns = false;
    };

    # override value from lxc-container profile; breaks java
    environment.noXlibs = false;

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
      ${lib.concatMapStringsSep "\n" (ip: ''
          Address = ${ip}
        '')
        config.it4r.lxc.ipAddrs}
      Gateway = 192.168.21.254
      LinkLocalAddressing = yes
      LLDP = yes
      EmitLLDP = customer-bridge
      IPv6AcceptRA = yes
      [DHCP]
      UseTimezone = yes
    '';
  };
}
