# Documentation Build Scripts

This directory contains build and automation scripts for the Boundless documentation.

## Scripts

### `build-docs-json.ts`
Merges `docs.base.json` and `navigation.yaml` to generate the final `docs.json` configuration.

**Usage:**
```bash
bun run scripts/build-docs-json.ts
bun run scripts/build-docs-json.ts --watch  # Watch mode
```

### `inject-version.ts`
Replaces `{{RELEASE_TAG}}` placeholders in MDX files with the actual release version from `snippets/release-version.mdx`.

**Usage:**
```bash
bun run scripts/inject-version.ts
```

**Files processed:**
- `provers/quick-start.mdx`
- `developers/tooling/cli.mdx`

### `check-version.ts`
Validates that the release tag in the documentation matches the latest release from `boundless-xyz/boundless`.

**Usage:**
```bash
# Check if version is up to date (exits 1 if outdated)
bun run scripts/check-version.ts

# Auto-update to latest release
bun run scripts/check-version.ts --auto-update
```

**Environment variables:**
- `GITHUB_TOKEN` - Optional GitHub token for higher API rate limits

## Version Management System

The documentation uses an automated version management system to stay in sync with the main Boundless repository.

### How It Works

1. **Source of Truth**: The release version is stored in `snippets/release-version.mdx`:
   ```mdx
   export const releaseTag = "release-1.1";
   ```

2. **Placeholders in Docs**: MDX files use `{{RELEASE_TAG}}` placeholders in code blocks:
   ```mdx
   ```bash
   git checkout {{RELEASE_TAG}}
   ```
   ```

3. **Build-Time Injection**: Before building, `inject-version.ts` replaces all placeholders with the actual version.

4. **Automated Checks**: A GitHub Action checks for new releases and alerts if the docs are out of sync.

### GitHub Actions Workflows

#### `check-version.yml`
Runs on every push, PR, and daily at 9 AM UTC. Validates that the docs version matches the latest release.

**Triggers:**
- Push to main/master
- Pull requests
- Daily schedule (9 AM UTC)
- Manual dispatch

**Behavior:**
- Fails the build if version is outdated
- Provides instructions on how to update

#### `build-docs.yml`
Builds the documentation with version injection.

**Steps:**
1. Injects release version into MDX files
2. Builds `docs.json` from base config and navigation
3. Deploys documentation (customize as needed)

### Manual Version Update

To manually update to a new release:

1. **Check current version:**
   ```bash
   bun run scripts/check-version.ts
   ```

2. **Auto-update to latest:**
   ```bash
   bun run scripts/check-version.ts --auto-update
   ```

3. **Or manually edit:**
   Edit `snippets/release-version.mdx` and change the `releaseTag` value:
   ```mdx
   export const releaseTag = "release-1.2"; // Update this
   ```

4. **Test locally:**
   ```bash
   bun run scripts/inject-version.ts
   # Verify the changes in affected MDX files
   ```

### Adding New Files with Version Placeholders

If you need to add version placeholders to additional files:

1. Add the file path to `FILES_TO_PROCESS` in `scripts/inject-version.ts`:
   ```typescript
   const FILES_TO_PROCESS = [
     "provers/quick-start.mdx",
     "developers/tooling/cli.mdx",
     "your/new/file.mdx", // Add here
   ];
   ```

2. Use `{{RELEASE_TAG}}` in your MDX code blocks:
   ```mdx
   ```bash
   cargo install --branch {{RELEASE_TAG}}
   ```
   ```

3. Test the injection:
   ```bash
   bun run scripts/inject-version.ts
   ```

## Development

### Prerequisites
- [Bun](https://bun.sh/) runtime
- GitHub token (optional, for higher API rate limits)

### Local Testing

```bash
# Test version check
bun run scripts/check-version.ts

# Test version injection
bun run scripts/inject-version.ts

# Test docs build
bun run scripts/build-docs-json.ts
```

### CI/CD Integration

The scripts are designed to run in GitHub Actions but can be integrated into any CI/CD pipeline:

```yaml
- name: Inject version
  run: bun run scripts/inject-version.ts

- name: Build docs
  run: bun run scripts/build-docs-json.ts
```

## Troubleshooting

### Version check fails with 404
The `boundless-xyz/boundless` repository might not have any releases yet, or the repository name has changed.

### Rate limit exceeded
If you're hitting GitHub API rate limits, set a `GITHUB_TOKEN` environment variable:
```bash
export GITHUB_TOKEN="ghp_your_token_here"
bun run scripts/check-version.ts
```

### Placeholders not replaced
Make sure:
1. You're using `{{RELEASE_TAG}}` (double curly braces)
2. The file is listed in `FILES_TO_PROCESS` in `inject-version.ts`
3. You've run the injection script before building
