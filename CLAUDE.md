# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Boundless documentation site (docs.boundless.network), built with Mintlify. Content is written in MDX files organized into sections: developers, provers, and zkc (ZK mining).

## Stack

- Only use [Bun](https://bun.sh/) instead of `npm`, `pnpm`, `yarn` etc.

## Commands

```bash
# Run local dev server
mint dev

# Build docs.json from navigation.yaml + docs.base.json
bun scripts/build-docs-json.ts
bun scripts/build-docs-json.ts --watch

# Check if docs version matches latest release
bun run scripts/check-version.ts
bun run scripts/check-version.ts --auto-update
```

## Architecture

**Navigation workflow:** Edit `navigation.yaml` (never `docs.json` directly), then run `bun scripts/build-docs-json.ts` to regenerate `docs.json` by merging with `docs.base.json`.

**Release versioning:** The release tag in `snippets/release-version.mdx` is imported by other docs. When updating versions, also find-replace the version string in `provers/quick-start.mdx` and `developers/tooling/cli.mdx`. CI automatically checks for version drift and can create PRs for updates.

## Code Style

- 2 spaces, no tabs
- MDX/JS: semicolons, single quotes, trailing commas (es5)
- JSON: double quotes, no trailing commas
