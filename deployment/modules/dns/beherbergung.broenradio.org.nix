{dns, ...}:
with dns.lib.combinators; {
  SOA = {
    nameServer =
      #"ns1";
      "ns1.broenradio.org.";

    adminEmail = "dns-admin@mission-lifeline.de";
    serial = 2022031001;
  };

  NS = [
    #"ns1"
    #"ns2"
    "ns1.broenradio.org."
    "ns2.broenradio.org."
  ];

  A = ["88.198.203.104"];
  AAAA = ["2a01:4f8:c0c:cf13::1"];

  subdomains = rec {
    server1 = host "88.198.203.104" "2a01:4f8:c0c:cf13::1";

    ns1 = server1;
    ns2 = server1; ## TODO

    backend = server1;
    search = server1;
    submission = server1;

    binarycache = server1;
    grafana = server1;

    prometheus-server1 = server1;
    loki-server1 = server1;
  };
}
