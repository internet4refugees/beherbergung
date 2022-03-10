{
  description = "https://github.com/internet4refugees/beherbergung.git development environment + package + deployment";

  inputs = {
    #nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-21.11";
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
  };

  outputs = { self, nixpkgs, sops-nix, nix-deploy-git, dns }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
    inherit (pkgs) lib;

    commonAttrs = {
      system = "x86_64-linux";
      extraArgs = { flake = self; inherit system dns; };
    };
    commonModules = [
      ./deployment/modules/nix.nix
      ./deployment/modules/default.nix
      #sops-nix.nixosModules.sops
      #./deployment/modules/sops.nix
      #./deployment/modules/dns.nix
      #./deployment/modules/monitoring/client.nix
      #./deployment/modules/nginx/timmi.nix
      #nix-deploy-git.nixosModule
      #./deployment/modules/nix-deploy-git.nix
    ];
  in
  rec {
    legacyPackages.${system} = (lib.mergeAttrs pkgs {
      #nixos-deploy = import ./tools/deploy.nix { inherit pkgs; };
    });
 
    #defaultPackage.${system} = legacyPackages.${system}.nixos-deploy;

    nixosConfigurations = {
  
      beherbergung-lifeline = nixpkgs.lib.nixosSystem (lib.mergeAttrs commonAttrs {
        modules = commonModules ++ [
          ./deployment/hosts/beherbergung-lifeline/configuration.nix
          #./deployment/modules/nginx/timmi-public.nix
          #./deployment/modules/binarycache/client.nix
          #./deployment/modules/binarycache/server.nix
          #./deployment/modules/monitoring/server.nix
        ];
      });

    };
  };
}
