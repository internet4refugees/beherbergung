This can be used for debugging or to test with a dump of the productive database before releasing a new software version:

```sh
curl 'https://URL/graphql' -H 'Content-Type: application/json' --data '{"query": "query Export{ export(password: \"ADMIN_PASSPHRASE\"){out err} }"}' | jq '.data.export.out' -r > /tmp/export.gpg
```

```sh
cd backend
gpg --decrypt /tmp/export.gpg | DB_SEED=/dev/stdin DB_INMEMORY=true lein run
```

## Preparation at server

Ensure, your server trusts the admin-keyid:

```sh
echo -e "5\ny\n" | gpg --command-fd 0 --expert --edit-key $ADMIN_GPG_ID trust
```
