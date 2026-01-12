{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_24
    bun
  ];

  shellHook = ''
    export PATH="$HOME/.bun/bin:$PATH"

    # Install Mintlify CLI if not already installed
    if ! command -v mint &> /dev/null; then
      echo "Installing Mintlify CLI via Bun..."
      bun install -g mintlify
    fi

    # Aliases for common tasks
    alias build-docs="bun scripts/build-docs-json.ts"
    alias build-docs-watch="bun scripts/build-docs-json.ts --watch"
    alias check-version="bun scripts/check-version.ts"
    alias check-version-update="bun scripts/check-version.ts --auto-update"

    # Build docs.json on entry to ensure it's up to date
    echo "Building docs.json..."
    bun scripts/build-docs-json.ts

    echo ""
    echo "Dev environment ready!"
    echo "  mint dev             - Start local dev server"
    echo "  build-docs           - Rebuild docs.json from navigation.yaml"
    echo "  build-docs-watch     - Watch mode for docs.json"
    echo "  check-version        - Check if docs version matches latest release"
    echo "  check-version-update - Auto-update to latest release version"
  '';
}
