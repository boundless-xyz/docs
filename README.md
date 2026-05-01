# Boundless Documentation

Official documentation for Boundless, available at [docs.boundless.network](https://docs.boundless.network).

Built with [Mintlify](https://mintlify.com/).

## Local Development

```bash
mint dev
```

## Editing

- **Content:** Edit MDX files in `developers/`, `provers/`, `zkc/`.
- **Navigation & config:** Edit `docs.json` directly.

## Updating Release Versions

When a new release drops, find-replace the version string (e.g. `release-2.0` → `release-2.1`) in:
- `snippets/release-version.mdx`
- `snippets/cli.mdx`
- `provers/quick-start.mdx`

Check the latest release:
```bash
gh release list -R boundless-xyz/boundless -L 1
```
