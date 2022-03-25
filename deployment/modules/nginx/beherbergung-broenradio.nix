{config, ...}: {
  imports = [
    ./common.nix
  ];

  ## while this old alternative subdomain is still used
  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    #"beherbergung.broenradio.org"
    "backend.beherbergung.broenradio.org"
    "search.beherbergung.broenradio.org"
    #"submission.beherbergung.broenradio.org"
  ];

  services.nginx.virtualHosts = {
    "search.beherbergung.broenradio.org" = {
      #default = true;  ## we would need cors settings supporting multiple hosts
      forceSSL = true;
      useACMEHost = config.networking.domain;
      basicAuthFile = config.sops.secrets."nginx-passwd".path;
      locations."/" = {
        proxyPass = "http://localhost:3000";
        #proxyWebsockets = true;
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
    "backend.beherbergung.broenradio.org" = {
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://localhost:4000";
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
  };
}
