# Boundless Documentation

This repository contains the official documentation for Boundless, available at [https://docs.boundless.network](https://docs.boundless.network).

## Updating Release Tags

**IMPORTANT:** When releasing a new version of Boundless, update the release tag in ONE place:

Edit [snippets/release-version.mdx](./snippets/release-version.mdx) and change the `RELEASE_TAG` value:

```javascript
export const RELEASE_TAG = "release-1.2"; // Update this value
```

This will automatically update all install commands and git checkout instructions across the entire documentation. Do NOT edit release tags in individual documentation files.

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
