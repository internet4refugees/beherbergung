{...}: {
  sops.gnupg.sshKeyPaths = ["/etc/ssh/ssh_host_rsa_key"];

  sops.defaultSopsFile = ../sops/secrets/default.json;
  sops.defaultSopsFormat = "json";

  ## Nginx passwd (basic auth of frontend/search for defence in depth)

  sops.secrets."nginx-passwd" = {
    sopsFile = ../sops/secrets/nginx-passwd;
    format = "binary";
    owner = "nginx";
  };
}
