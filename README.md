# Boundless Documentation

This repository contains the official documentation for Boundless, available at [https://docs.boundless.network](https://docs.boundless.network).

## Updating Release Tags

The documentation uses a version management system to stay in sync with releases from [boundless-xyz/boundless](https://github.com/boundless-xyz/boundless).

### Updating the Version

**Option 1: Auto-update to latest release**
```bash
bun run scripts/check-version.ts --auto-update
```

**Option 2: Manual edit**
Edit [snippets/release-version.mdx](./snippets/release-version.mdx) and change the `releaseTag` value:

```javascript
export const releaseTag = "release-1.2"; // Update this value
```

### How It Works

1. The release version is stored in `snippets/release-version.mdx`
2. Documentation files use `{{RELEASE_TAG}}` placeholders in code blocks
3. During the build process, these placeholders are replaced with the actual version
4. A GitHub Action checks for new releases and alerts if the docs are out of sync

**Do NOT edit release tags directly in individual documentation files.** Always update `snippets/release-version.mdx` or use the auto-update script.

For more details, see [scripts/README.md](./scripts/README.md).

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
