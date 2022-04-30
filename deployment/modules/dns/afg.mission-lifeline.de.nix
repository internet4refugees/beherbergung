{dns, ...}:
with dns.lib.combinators; rec {
  SOA = {
    nameServer = "ns1.broenradio.org.";

    adminEmail = "dns-admin@mission-lifeline.de";
    serial = 2022043001;
  };

  NS = [
    "ns1.broenradio.org."
    "ns2.broenradio.org."
  ];

  A = ["65.108.193.134"];
  AAAA = ["2a01:4f9:1a:95a9::1"];

  subdomains = rec {
    server-dedicated1 = {inherit A AAAA;};

    staging = server-dedicated1;

    mqtt = server-dedicated1;

    #binarycache = server-dedicated1;
    #grafana = server-dedicated1;

    #prometheus-server-dedicated1 = server-dedicated1;
    #loki-server-dedicated1 = server-dedicated1;
  };
}

