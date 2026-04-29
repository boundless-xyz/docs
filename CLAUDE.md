# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Boundless documentation site (docs.boundless.network), built with Mintlify. Content is written in MDX files organized into sections: developers, provers, and zkc (ZK mining).

## Commands

```bash
# Run local dev server
mint dev
```

## Architecture

**Configuration:** Edit `docs.json` directly — it's the single Mintlify config file containing theme, navigation, and all settings.

**Release versioning:** When a new version of `boundless-xyz/boundless` is released, find-replace the version string (e.g. `release-1.5`) across these files:
- `snippets/release-version.mdx`
- `snippets/cli.mdx`
- `provers/quick-start.mdx`

You can check the latest release with: `gh release list -R boundless-xyz/boundless -L 1`

## Code Style

- 2 spaces, no tabs
- MDX/JS: semicolons, single quotes, trailing commas (es5)
- JSON: double quotes, no trailing commas
