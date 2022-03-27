{
  config,
  pkgs,
  ...
}: {
  system.stateVersion = "21.11";

  networking.hostName = "beherbergung-warhelp";

  imports = [
    ../../modules/nspawn-container.nix
  ];

  it4r.lxc.ipAddrs = [
    "192.168.21.1/24"
    "2a01:4f8:10b:49f:1::1/80"
  ];

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
