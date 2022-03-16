{ dns, ... }:

with dns.lib.combinators; {
  SOA = {
    nameServer = "ns1.broenradio.org.";

    adminEmail = "dns-admin@warhelp.eu";
    serial = 2022032201;
  };

  NS = [
    "ns1.broenradio.org."
    "ns2.broenradio.org."
  ];

  #CNAME = [ "eve.thalheim.io" ];  ## not possible for the subdomain
  A = [ "88.99.244.96" ];
  AAAA = [ "2a01:4f8:10b:49f::2" ];

  subdomains = rec {
    #mic1 = cname "eve.thalheim.io";  ## TODO why doesn't it work?
    mic1 = host "88.99.244.96" "2a01:4f8:10b:49f::2";

    backend = mic1;
    search = mic1;
    submission = mic1;

    binarycache = mic1;
    grafana = mic1;

    prometheus-mic1 = mic1;
    loki-mic1 = mic1;
  };
}
