# Boundless Documentation

This repository contains the official documentation for Boundless, available at [https://docs.boundless.network](https://docs.boundless.network).

## Updating Release Tags

When a new release comes out, find-replace the version string (e.g., `release-1.1` → `release-1.2`) in:
- `provers/quick-start.mdx`
- `developers/tooling/cli.mdx`
- `snippets/release-version.mdx`

A GitHub Action checks for new releases and alerts if the docs are out of sync. You can also run `bun run scripts/check-version.ts` to check manually.

## Local Development

### Prerequisites

- Node.js version 24
- Bun package manager

### Setup

1. Install Mintlify globally:
   ```bash
   bun install -g mintlify
   ```

2. Run the development server:
   ```bash
   mint dev
   ```

The documentation site will be available locally for preview and editing.

## Editing Navigation

**IMPORTANT:** Do not edit `docs.json` directly!

To modify navigation items:

1. Edit the `navigation.yaml` file (this is the user-friendly navigation configuration)
2. Run the build script:
   ```bash
   bun scripts/build-docs-json.ts
   ```
   
   For development, you can use watch mode to automatically rebuild on changes:
   ```bash
   bun scripts/build-docs-json.ts --watch
   ```

3. This will automatically generate the necessary changes in `docs.json`

The `docs.base.json` file can be edited for other configuration changes, but for navigation structure, always use the YAML workflow above.
