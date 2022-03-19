{config, ...}: {
  imports = [
    ./common.nix
  ];

  security.acme.certs."${config.networking.domain}".extraDomainNames = [
    "beherbergung.mission-lifeline.de"
    "backend.beherbergung.mission-lifeline.de"
    "search.beherbergung.mission-lifeline.de"
    "submission.beherbergung.mission-lifeline.de"
  ];
}
