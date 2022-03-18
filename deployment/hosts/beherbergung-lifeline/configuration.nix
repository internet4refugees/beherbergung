{
  config,
  pkgs,
  ...
}: {
  imports = [
    ../../modules/hetzner.nix
  ];

  system.stateVersion = "21.11";

  networking = {
    hostName = "beherbergung-lifeline";
    interfaces.ens3 = {
      ipv6.addresses = [
        {
          address = "2a01:4f8:c0c:cf13::1";
          prefixLength = 64;
        }
      ];
    };
  };

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
