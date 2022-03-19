{
  makeTest,
  pkgs,
  beherbergung-module,
}:
# Debug like this:
# $ nix build .\#checks.x86_64-linux.nixos-test.driver
# $ ./result/bin/nixos-test-driver --interactive
# >>> start_all()
# >>> server.shell_interact()
makeTest {
  name = "beherberung";
  nodes.server = {...}: {
    virtualisation.memorySize = 2046; # java...
    imports = [beherbergung-module];
  };

  testScript = ''
    start_all()
    server.wait_for_unit("beherbergung-backend.service")
    resp = server.wait_until_succeeds("curl http://localhost:4000/health")
    assert resp.strip() == "ok"
  '';
} {
  inherit pkgs;
  inherit (pkgs) system;
}
