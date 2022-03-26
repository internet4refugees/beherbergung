{dns, ...}:
with dns.lib.combinators; rec {
  SOA = {
    nameServer = "ns1.broenradio.org.";

    adminEmail = "dns-admin@mission-lifeline.de";
    serial = 2022032501;
  };

  NS = [
    "ns1.broenradio.org."
    "ns2.broenradio.org."
  ];

  A = ["88.198.203.104"];
  AAAA = ["2a01:4f8:c0c:cf13::1"];

  subdomains = rec {
    server-cloud1 = {inherit A AAAA;};
    ns1 = server-cloud1; ## at the moment set as ns-record for *.mission-lifeline.de

    backend = server-cloud1;
    search = server-cloud1;
    #submission = server-cloud1;

    #binarycache = server-cloud1;
    #grafana = server-cloud1;

    #prometheus-server-cloud1 = server-cloud1;
    #loki-server-cloud1 = server-cloud1;
  };
}
