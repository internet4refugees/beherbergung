{
  description = "https://github.com/internet4refugees/beherbergung.git development environment + package + deployment";

  nixConfig.extra-substituters = ["https://cache.garnix.io"];
  nixConfig.extra-trusted-public-keys = ["cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="];

  inputs = {
    #nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-21.11";

    alejandra = {
      url = "github:kamadorueda/alejandra/1.1.0";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    sops-nix = {
      url = "github:Mic92/sops-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-deploy-git = {
      url = "github:johannesloetzsch/nix-deploy-git/main";
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
  };

  outputs = {
    self,
    nixpkgs,
    sops-nix,
    nix-deploy-git,
    dns,
    alejandra,
    mvn2nix,
    nixos-shell
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
      ./deployment/modules/nix.nix
      ./deployment/modules/default.nix
      sops-nix.nixosModules.sops
      ./deployment/modules/sops.nix
      ./deployment/modules/dns.nix
      #./deployment/modules/monitoring/client.nix
      ./deployment/modules/nginx/beherbergung.nix
      #nix-deploy-git.nixosModule
      #./deployment/modules/nix-deploy-git.nix
    ];
    linters = [
      # TODO: switch to alejandra from nixpkgs in 22.05
      alejandra.defaultPackage.${system}
      pkgs.treefmt
      pkgs.clj-kondo
      pkgs.shellcheck
      pkgs.shfmt
    ];
  in rec {
    legacyPackages.${system} = lib.mergeAttrs pkgs {
      #nixos-deploy = import ./tools/deploy.nix { inherit pkgs; };
    };

    packages.${system} = {
      devShell = self.devShell.${system}.inputDerivation;
      backendUpdatedDeps = pkgs.callPackage ./backend/nix/tools/updated-deps.nix {
        inherit (mvn2nix.legacyPackages.${system}) mvn2nix;
      };
      beherbergung-backend = pkgs.callPackage ./backend/nix/beherbergung-backend.nix {
        inherit (mvn2nix.legacyPackages.${system}) buildMavenRepositoryFromLockFile;
        inherit pkgs;
      };
    };

    checks.${system} = {
      format =
        pkgs.runCommandNoCC "treefmt" {
          nativeBuildInputs = linters;
        } ''
          cp -r ${self} source && chmod -R +w source
          cd source
          HOME=$TMPDIR treefmt --fail-on-change
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
          pkgs.nodePackages.prettier
          nixos-shell.packages.${system}.nixos-shell
        ]
        ++ linters;
      shellHook = ''
        export PATH=${(pkgs.callPackage ./frontend/search {})}/libexec/beherbergung/node_modules/.bin:$PATH
      '';
    };

    nixosModules = {
      beherbergung = import ./deployment/modules/beherbergung.nix {
        inherit (self.packages.${system}) beherbergung-backend;
      };
    };

    nixosConfigurations = {
      # use nixos-shell --flake .#vm
      vm = lib.makeOverridable nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          self.nixosModules.beherbergung
          # dummy value to make ci happy
          {
             boot.loader.systemd-boot.enable = true;
             fileSystems."/" = {
               device = "/dev/disk/by-uuid/00000000-0000-0000-0000-000000000000";
               fsType = "btrfs";
             };
          }
        ];
      };

      beherbergung-lifeline = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules =
          commonModules
          ++ [
            ./deployment/hosts/beherbergung-lifeline/configuration.nix
            #./deployment/modules/nginx/beherbergung-lifeline.nix
            #./deployment/modules/binarycache/client.nix
            #./deployment/modules/binarycache/server.nix
            #./deployment/modules/monitoring/server.nix
          ];
      });

      beherbergung-warhelp = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules =
          # commonModules ++
          [
            ./deployment/hosts/beherbergung-warhelp/configuration.nix
            ./deployment/modules/nix.nix
            ./deployment/modules/default.nix
          ];
      });
    };

    hydraJobs = with nixpkgs.lib;
      let
        hydraJobs = mapAttrs (_: hydraJob);
      in {
        checks = hydraJobs self.checks.x86_64-linux;
        packages = hydraJobs self.packages.x86_64-linux;
        nixosConfigurations = mapAttrs (_: nixos:
          hydraJob nixos.config.system.build.toplevel
        ) self.nixosConfigurations;
      };
  };
}
