# Version Management System

This repository uses an automated version management system to keep documentation in sync with the [boundless-xyz/boundless](https://github.com/boundless-xyz/boundless) repository.

## Quick Reference

```bash
# Check if docs are up to date
bun run scripts/check-version.ts

# Auto-update to latest release
bun run scripts/check-version.ts --auto-update

# Inject version into MDX files (for local preview)
bun run scripts/inject-version.ts
```

## How It Works

### 1. Source of Truth
The release version is stored in `snippets/release-version.mdx`:
```javascript
export const releaseTag = "release-1.1";
```

### 2. Placeholders in Documentation
MDX files use `{{RELEASE_TAG}}` placeholders in code blocks:
```bash
git checkout {{RELEASE_TAG}}
cargo install --branch {{RELEASE_TAG}}
```

### 3. Build-Time Injection
During the build process, `scripts/inject-version.ts` replaces all `{{RELEASE_TAG}}` placeholders with the actual version.

### 4. Intelligent Branch Detection
The system automatically detects the correct branch from GitHub releases:

- **For patch releases** (e.g., v1.1.2): Extracts branch from release notes
  - Release notes say `--branch release-1.1` → uses `release-1.1`
  
- **For minor/major releases** (e.g., v1.2.0): Converts tag to branch format
  - Tag `v1.2.0` → branch `release-1.2`
  
- **Verification**: Always verifies the branch exists before updating

### 5. Automated Monitoring
GitHub Actions run daily to:
- Check for new releases
- Verify docs are in sync
- Automatically create PRs for updates

## GitHub Actions Workflows

### ✅ Version Check (`check-version.yml`)
**Runs on:** Every push, PR, and daily at 9 AM UTC

**Purpose:** Ensures documentation stays in sync

**Behavior:**
- Compares docs version with latest boundless release
- Fails CI if outdated
- Provides update instructions

### 🤖 Auto-Update (`auto-update-version.yml`)
**Runs on:** Daily at 9 AM UTC (or manual trigger)

**Purpose:** Automatically creates PRs for new releases

**Behavior:**
1. Detects new releases from boundless-xyz/boundless
2. Extracts correct branch from release notes
3. Updates `snippets/release-version.mdx`
4. Creates PR with changes

### 🏗️ Build Docs (`build-docs.yml`)
**Runs on:** Every push and PR

**Purpose:** Builds documentation with version injection

**Steps:**
1. Injects release version into MDX files
2. Builds docs.json configuration
3. Ready for deployment

## Important Notes

### ⚠️ Never Commit Injected Versions
The `{{RELEASE_TAG}}` placeholders should **always** remain in the source MDX files. The injection happens at build time, not in source control.

**Correct (in git):**
```bash
git checkout {{RELEASE_TAG}}
```

**Incorrect (don't commit):**
```bash
git checkout release-1.1
```

### 🔍 Branch vs Tag Detection
The system is smart about releases:

**Example:** For release `v1.1.2`:
1. Fetches release from GitHub API
2. Reads release notes/body
3. Finds: `--branch release-1.1` in instructions
4. Verifies branch `release-1.1` exists
5. Uses `release-1.1` (not `v1.1.2`)

This ensures the documentation always references valid git branches, not version tags.

### 📝 Adding Version Placeholders to New Files

1. Add file path to `scripts/inject-version.ts`:
   ```typescript
   const FILES_TO_PROCESS = [
     "provers/quick-start.mdx",
     "developers/tooling/cli.mdx",
     "your/new/file.mdx", // Add here
   ];
   ```

2. Use `{{RELEASE_TAG}}` in code blocks:
   ```mdx
   ```bash
   git checkout {{RELEASE_TAG}}
   ```
   ```

3. Test locally:
   ```bash
   bun run scripts/inject-version.ts
   ```

## Troubleshooting

### "Version mismatch detected" but release is correct
This is expected! Run the auto-update:
```bash
bun run scripts/check-version.ts --auto-update
```

### Branch extraction fails
If release notes don't contain branch reference and version tag doesn't match a branch:
1. Manually update `snippets/release-version.mdx`
2. Or improve the regex in `scripts/check-version.ts` function `extractBranchFromRelease()`

### CI fails with "version outdated"
This is intentional! It alerts you to update docs when new releases are published.

**Options:**
1. Wait for automated PR from `auto-update-version.yml`
2. Manually run: `bun run scripts/check-version.ts --auto-update`
3. Manually edit `snippets/release-version.mdx`

### Local preview shows `{{RELEASE_TAG}}`
Run the injection script before previewing:
```bash
bun run scripts/inject-version.ts
mintlify dev
```

## Manual Version Update Workflow

If you need to manually update:

1. **Check current status:**
   ```bash
   bun run scripts/check-version.ts
   ```

2. **Auto-update:**
   ```bash
   bun run scripts/check-version.ts --auto-update
   ```

3. **Verify change:**
   ```bash
   cat snippets/release-version.mdx
   ```

4. **Test injection:**
   ```bash
   bun run scripts/inject-version.ts
   git diff provers/quick-start.mdx
   ```

5. **Revert test files:**
   ```bash
   git checkout provers/quick-start.mdx developers/tooling/cli.mdx
   ```

6. **Commit only the snippet:**
   ```bash
   git add snippets/release-version.mdx
   git commit -m "chore: update release version to release-X.Y"
   ```

## Architecture

```
┌─────────────────────────────────────┐
│  boundless-xyz/boundless releases   │
│  (Source of truth)                  │
└────────────┬────────────────────────┘
             │
             │ Daily check via GitHub API
             ▼
┌─────────────────────────────────────┐
│  scripts/check-version.ts           │
│  - Fetches latest release           │
│  - Parses release notes             │
│  - Extracts branch name             │
│  - Verifies branch exists           │
└────────────┬────────────────────────┘
             │
             │ Updates
             ▼
┌─────────────────────────────────────┐
│  snippets/release-version.mdx       │
│  export const releaseTag = "..."    │
└────────────┬────────────────────────┘
             │
             │ Read by
             ▼
┌─────────────────────────────────────┐
│  scripts/inject-version.ts          │
│  - Reads releaseTag                 │
│  - Finds {{RELEASE_TAG}} in MDX     │
│  - Replaces with actual version     │
└────────────┬────────────────────────┘
             │
             │ Updates
             ▼
┌─────────────────────────────────────┐
│  Documentation files (build time)   │
│  - provers/quick-start.mdx          │
│  - developers/tooling/cli.mdx       │
└─────────────────────────────────────┘
```

## See Also

- [scripts/README.md](./scripts/README.md) - Detailed script documentation
- [.github/workflows/README.md](./.github/workflows/README.md) - GitHub Actions documentation
- [README.md](./README.md) - General repository documentation
