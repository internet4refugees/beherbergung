{config, ...}: {
  ## After updating the nixpkgs, the acme-unit failed. It was mitigated by:
  ## > chmod acme:nginx /var/lib/acme/

  security.acme = {
    acceptTerms = true;
    email = "acme-admin@mission-lifeline.de";
    preliminarySelfsigned = true;
    #server = "https://acme-staging-v02.api.letsencrypt.org/directory";
  };

  services.nginx = {
    enable = true;
    recommendedTlsSettings = true;
    recommendedOptimisation = true;
    recommendedGzipSettings = true;
    commonHttpConfig = ''
      #types_hash_max_size 1024;
      server_names_hash_bucket_size 128;
    '';

    virtualHosts = {
      "${config.networking.domain}" = {
        forceSSL = true;
        enableACME = true;
        root = "/var/www";
        extraConfig = ''autoindex on;'';
      };
    };
  };

  networking.firewall.allowedTCPPorts = [80 443];
}
