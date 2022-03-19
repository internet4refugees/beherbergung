{
  makeTest,
  pkgs,
  beherbergung-module
}:
makeTest {
  name = "beherberung";
  nodes.server = {...}: {
    imports = [ beherbergung-module ];
  };

  testScript = ''
    start_all()
    server.wait_for_unit("beherbergung-backend.service")
  '';
} {
  inherit pkgs;
  inherit (pkgs) system;
}
