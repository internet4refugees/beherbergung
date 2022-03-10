{config, pkgs, nixpkgs, system, dns, ...}:
let
   util = dns.util.${system};
in
{
  networking.domain = "beherbergung.mission-lifeline.de";

  services.bind = {
    enable = true;
    zones = {
      "${config.networking.domain}" = {
        master = true;
        file = util.writeZone "${config.networking.domain}" (import (./dns + "/${config.networking.domain}.nix") {inherit dns;});
      };
      "beherbergung.broenradio.org" = {  ## not required in future (but till the NS-record of beherbergung.mission-lifeline.de is configured)
        master = true;
        file = util.writeZone "beherbergung.broenradio.org" (import (./dns + "/${config.networking.domain}.nix") {inherit dns;});
      };
    };
  };
  networking.firewall.allowedTCPPorts = [ 53 ];
  networking.firewall.allowedUDPPorts = [ 53 ];
}
