# Prepare development environment

This repository makes heavy use of [the nix package manager](https://nixos.org/)
for building and deployment. Follow these
[instructions](https://nixos.org/download.html) to install nix in Linux, Windows
or macOS.

After installing nix to get a shell that has all development dependencies set up, run the following command:

```console
$ nix develop
```

# Start development server

```
$ hivemind
```

# Linters and formatting

To format and lint all project source code run:

```
$ treefmt
```

# Run tests

```
$ nix flake check -vL
```

# Update dependencies

When you update clojure dependencies in backend/project.clj, run:

```
$ nix run .#packages.x86_64-linux.updateBackendDeps
```

When you update javascript dependencies in frontend/search/packages.json, run:

```
$ nix run .#packages.x86_64-linux.updateFrontendDeps
```
