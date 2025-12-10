# Documentation Build Scripts

This directory contains build and automation scripts for the Boundless documentation.

## Scripts

### `build-docs-json.ts`
Merges `docs.base.json` and `navigation.yaml` to generate the final `docs.json` configuration.

```bash
bun run scripts/build-docs-json.ts
bun run scripts/build-docs-json.ts --watch  # Watch mode
```

### `check-version.ts`
Checks if the release version in the docs matches the latest release from `boundless-xyz/boundless`.

```bash
# Check if version is up to date
bun run scripts/check-version.ts

# Auto-update snippets/release-version.mdx to latest
bun run scripts/check-version.ts --auto-update
```

## Updating Release Versions

When a new release comes out:

1. Run `bun run scripts/check-version.ts --auto-update` to update `snippets/release-version.mdx`
2. Find-replace `release-1.1` → `release-1.2` (or whatever the old/new version is) in:
   - `provers/quick-start.mdx`
   - `developers/tooling/cli.mdx`

That's it. The `check-version.ts` script will alert you via CI when docs are out of sync.
