{ config, pkgs, nixpkgs, ... }:
{
  imports = [
    ./common.nix
  ];

  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    "backend.${config.networking.domain}"
    "search.${config.networking.domain}"
    "submission.${config.networking.domain}"
  ];

  services.nginx.virtualHosts = {
    "search.${config.networking.domain}" = {
      #default = true;  ## we would need cors settings supporting multiple hosts
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://localhost:3000";
        #proxyWebsockets = true;
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
    "backend.${config.networking.domain}" = {
      forceSSL = true;
      useACMEHost = config.networking.domain;
      locations."/" = {
        proxyPass = "http://localhost:4000";
        extraConfig = "proxy_pass_header Authorization;";
      };
    };
  };
}
