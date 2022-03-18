This repository contains the completely declarative+reproducible configurations to deploy a server hosting the „beherbergung“ service and basic infrastructure for reliabiliy+maintainability.
Most of the service definitions should re reusable with minimal adaptions for completely different projects.

- CI/CD
- buildcache
- [monitoring + alerting](./modules/monitoring/README.md)
- backup
- dns
- reverse proxy + acme

Secrets are encrypted with sops.

## Deploy

Once the servers are installed following [the bootstrap instructions](#bootstrap), the roll out of configuration changes on all servers is trivial.
As a developer with an [authorized key](./modules/hetzner.nix), call:

```shell
nix run
```

## Update

To update all flakes and redeploy, call:

```shell
nix flake update
nix run
```

## Bootstrap

To setup a new server:

1. boot a nixos image
2. mount the future / to /mnt
3. copy this repo to /mnt/etc/nixos
4. check flake.nix and hosts/$HOSTNAME/\*configuration.nix

- set a correct static ipv6

5. nixos-install:

```shell
nix-shell -p nixUnstable --command "nixos-install --no-root-passwd --flake .#${HOSTNAME}"
```

6. setup sops:

6.1. add the new hosts key to sops config

```shell
nix shell /etc/nixos#ssh-to-pgp --command ssh-to-pgp -i /etc/ssh/ssh_host_rsa_key
edit .sops.yaml sops/keys/hosts/$HOSTNAME.asc
```

6.2. add pubkey to the developers keyring

```shell
gpg --import sops/keys/hosts/$HOSTNAME.asc
```

6.3. edit secrets + use them

```shell
nix shell .#sops --command sops sops/secrets/*
edit modules/sops.nix
```

## Ensure, outgoing SMTP is permitted by your hoster:

```shell
openssl s_client -connect smtp.1und1.de:587 -starttls smtp
openssl s_client -connect smtp.1und1.de:465
```
