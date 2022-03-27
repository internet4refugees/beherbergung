{lib, ...}: {
  it4r.beherbergung-backend.settings = {
    VERBOSE = "true";
    DB_INMEMORY = "true";
    IMPORT_NGO = "random";
    IMPORT_FILE = lib.mkDefault (toString ../../backend/src/beherbergung/db/seed/test.edn);
  };
}
