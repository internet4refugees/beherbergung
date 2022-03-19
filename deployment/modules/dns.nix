{
  config,
  system,
  dns,
  ...
}: let
  util = dns.util.${system};
in {
  networking.domain = "beherbergung.broenradio.org";
  # "beherbergung.mission-lifeline.de";

  services.bind = {
    enable = true;
    zones = {
      "${config.networking.domain}" = {
        master = true;
        file = util.writeZone "${config.networking.domain}" (import (./dns + "/${config.networking.domain}.nix") {inherit dns;});
      };
      "beherbergung.mission-lifeline.de" = {
        ## not required in future (but till the NS-record of beherbergung.mission-lifeline.de is configured)
        master = true;
        file = util.writeZone "beherbergung.mission-lifeline.de" (import (./dns + "/${config.networking.domain}.nix") {inherit dns;});
      };
      "search.warhelp.eu" = {
        master = true;
        file = util.writeZone "search.warhelp.eu" (import (./dns + "/search.warhelp.eu.nix") {inherit dns;});
      };
      "warhelp.broenradio.org" = {
        ## till NS-record of "search.warhelp.eu" is set
        master = true;
        file = util.writeZone "warhelp.broenradio.org" (import (./dns + "/search.warhelp.eu.nix") {inherit dns;});
      };
    };
  };
  networking.firewall.allowedTCPPorts = [53];
  networking.firewall.allowedUDPPorts = [53];
}
