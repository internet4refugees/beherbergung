{dns, ...}:
with dns.lib.combinators; rec {
  SOA = {
    nameServer = "ns1.broenradio.org.";

    adminEmail = "dns-admin@warhelp.eu";
    serial = 2022031701;
  };

  NS = [
    "ns1.broenradio.org."
    "ns2.broenradio.org."
  ];

  A = ["88.99.244.96"];
  AAAA = ["2a01:4f8:10b:49f:1::1"];

  subdomains = {
    backend = {inherit A AAAA;};
    #submission = mic1;

    #binarycache = mic1;
    #grafana = mic1;

    #prometheus-mic1 = mic1;
    #loki-mic1 = mic1;
  };
}
