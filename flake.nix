{
  description = "https://github.com/internet4refugees/beherbergung.git development environment + package + deployment";

  nixConfig.extra-substituters = ["https://cache.garnix.io"];
  nixConfig.extra-trusted-public-keys = ["cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="];

  inputs = {
    # use 21.11-small for fast security updates
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-21.11-small";

    alejandra = {
      url = "github:kamadorueda/alejandra/1.1.0";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    sops-nix = {
      url = "github:Mic92/sops-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    dns = {
      url = "github:kirelagin/dns.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    mvn2nix = {
      url = "github:fzakaria/mvn2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixos-shell = {
      url = "github:Mic92/nixos-shell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    naersk = {
      url = "github:nix-community/naersk";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    deadnix = {
      url = "github:astro/deadnix";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.naersk.follows = "naersk";
      inputs.fenix.follows = "fenix";
    };
  };

  outputs = {
    self,
    nixpkgs,
    sops-nix,
    dns,
    alejandra,
    mvn2nix,
    nixos-shell,
    deadnix,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
    inherit (pkgs) lib;

    commonAttrs = {
      system = "x86_64-linux";
      extraArgs = {
        flake = self;
        inherit system dns;
      };
    };
    commonModules = [
    ];
    linters = [
      # TODO: switch to alejandra from nixpkgs in 22.05
      alejandra.defaultPackage.${system}
      pkgs.treefmt
      pkgs.clj-kondo
      pkgs.shfmt
      pkgs.nodePackages.prettier
    ];
  in rec {
    legacyPackages.${system} = lib.mergeAttrs pkgs {
      #nixos-deploy = import ./tools/deploy.nix { inherit pkgs; };
    };

    packages.${system} = {
      devShell = self.devShell.${system}.inputDerivation;
      updateBackendDeps = pkgs.callPackage ./backend/nix/tools/updated-deps.nix {
        inherit (mvn2nix.legacyPackages.${system}) mvn2nix;
      };
      beherbergung-backend = pkgs.callPackage ./backend/nix/beherbergung-backend.nix {
        inherit (mvn2nix.legacyPackages.${system}) buildMavenRepositoryFromLockFile;
        inherit pkgs;
      };
      beherbergung-fullstack = self.packages.${system}.beherbergung-backend.override {
        patchPublic = self.packages.${system}.beherbergung-frontend-assets;
      };
      inherit
        (pkgs.callPackages ./frontend/search {})
        beherbergung-frontend-deps
        updateFrontendDeps
        beherbergung-frontend-assets
        ;
    };
    apps.${system} = {
      # Run the VM with `nixos run .#vm`
      vm = {
        type = "app";
        program = let
          config = self.nixosConfigurations.vm.config;
        in "${config.system.build.vm}/bin/run-${config.networking.hostName}-vm";
      };
    };

    checks.${system} = {
      format =
        pkgs.runCommandNoCC "treefmt" {
          nativeBuildInputs = linters;
        } ''
          # keep timestamps so that treefmt is able to detect mtime changes
          cp --no-preserve=mode --preserve=timestamps -r ${self} source
          cd source
          HOME=$TMPDIR treefmt --fail-on-change
          touch $out
        '';

      nixos-test = import ./deployment/tests/nixos-test.nix {
        inherit pkgs;
        makeTest = import (pkgs.path + "/nixos/tests/make-test-python.nix");
        beherbergung-module = self.nixosModules.beherbergung;
      };

      deadnix =
        pkgs.runCommandNoCC "deadnix" {
          nativeBuildInputs = [deadnix.packages.${system}.deadnix];
        } ''
          deadnix -f ${self}
          touch $out
        '';
    };

    devShell.${system} = pkgs.mkShell {
      nativeBuildInputs =
        [
          pkgs.leiningen
          pkgs.yarn
          pkgs.hivemind
          pkgs.nodejs
          pkgs.entr
          pkgs.yarn2nix
          nixos-shell.packages.${system}.nixos-shell
        ]
        ++ linters;
      # disable https://nextjs.org/telemetry
      NEXT_TELEMETRY_DISABLED = "1";
      shellHook = ''
        export PATH=${self.packages.${system}.beherbergung-frontend-deps}/libexec/beherbergung/node_modules/.bin:$PATH
      '';
    };

    nixosModules = {
      beherbergung = import ./deployment/modules/beherbergung.nix {
        inherit (self.packages.${system}) beherbergung-fullstack;
      };
      beherbergung-demo = import ./deployment/modules/beherbergung-demo.nix;
    };

    nixosConfigurations = {
      # use nixos-shell --flake .#vm
      vm = lib.makeOverridable nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          self.nixosModules.beherbergung
          self.nixosModules.beherbergung-demo
          # dummy value to make ci happy
          {
            boot.loader.systemd-boot.enable = true;
            fileSystems."/" = {
              device = "/dev/disk/by-uuid/00000000-0000-0000-0000-000000000000";
              fsType = "btrfs";
            };
          }
          # allow port 4000 from host machine
          ({modulesPath, ...}: {
            imports = [
              (modulesPath + "/virtualisation/qemu-vm.nix")
            ];
            # port forward backend
            virtualisation.forwardPorts = [
              {
                host.port = 4000;
                guest.port = 4000;
              }
            ];
            networking.firewall.allowedTCPPorts = [4000];
          })
        ];
      };

      beherbergung-demo = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules =
          commonModules
          ++ [
            ./deployment/hosts/beherbergung-demo/configuration.nix
            self.nixosModules.beherbergung
            self.nixosModules.beherbergung-demo
          ];
      });

      beherbergung-lifeline = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules =
          commonModules
          ++ [
            sops-nix.nixosModules.sops
            ./deployment/hosts/beherbergung-lifeline/configuration.nix
            ./deployment/modules/nginx/beherbergung-broenradio.nix
            #./deployment/modules/binarycache/client.nix
            #./deployment/modules/binarycache/server.nix
            #./deployment/modules/monitoring/server.nix
          ];
      });

      beherbergung-warhelp = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules =
          commonModules
          ++ [
            ./deployment/hosts/beherbergung-warhelp/configuration.nix
          ];
      });
    };

    hydraJobs = with nixpkgs.lib; let
      hydraJobs = pkgs:
        mapAttrs (_: hydraJob) (
          nixpkgs.lib.filterAttrs (
            _: pkg:
              pkg ? meta
          )
          pkgs
        );
    in {
      checks = hydraJobs self.checks.x86_64-linux;
      packages = hydraJobs self.packages.x86_64-linux;
      nixosConfigurations =
        mapAttrs (
          _: nixos:
            hydraJob nixos.config.system.build.toplevel
        )
        self.nixosConfigurations;
    };
  };
}
