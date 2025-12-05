# GitHub Actions Workflows

This directory contains automated workflows for the Boundless documentation.

## Workflows

### `check-version.yml` - Version Validation
**Purpose:** Ensures documentation version stays in sync with boundless-xyz/boundless releases

**Triggers:**
- Every push to main/master
- Pull requests
- Daily at 9 AM UTC
- Manual dispatch

**Behavior:**
- Fetches latest release from boundless-xyz/boundless
- Compares with version in `snippets/release-version.mdx`
- ✅ Passes if versions match
- ❌ Fails if outdated (with instructions to update)

### `auto-update-version.yml` - Automatic PR Creation
**Purpose:** Automatically creates PRs when new releases are detected

**Triggers:**
- Daily at 9 AM UTC
- Manual dispatch

**Behavior:**
- Checks for new releases from boundless-xyz/boundless
- If found, auto-updates `snippets/release-version.mdx`
- Creates a PR with the changes
- Labels PR as `automated` and `version-update`

**Note:** Requires repository permissions for `contents: write` and `pull-requests: write`

### `build-docs.yml` - Documentation Build
**Purpose:** Builds documentation with proper version injection

**Triggers:**
- Push to main/master
- Pull requests
- Manual dispatch

**Steps:**
1. Injects release version into MDX files (`{{RELEASE_TAG}}` → actual version)
2. Builds `docs.json` from base config and navigation YAML
3. Ready for deployment step (customize as needed)

## Manual Workflow Triggers

You can manually trigger any workflow from the GitHub Actions tab:

1. Go to "Actions" in your repository
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

## Required Secrets

The workflows use the default `GITHUB_TOKEN` which is automatically provided by GitHub Actions. No additional secrets are required.

For higher GitHub API rate limits in `check-version.yml`, you can optionally set a personal access token as `GITHUB_TOKEN` in repository secrets.

## Customizing

### Change Schedule

To modify when workflows run, edit the `cron` expression:

```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9 AM UTC
```

Cron syntax: `minute hour day month weekday`

Examples:
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Every Monday at midnight
- `0 12 * * 1-5` - Weekdays at noon

## Troubleshooting

### Auto-update PR not created
- Check workflow permissions in Settings → Actions → General → Workflow permissions
- Ensure "Allow GitHub Actions to create and approve pull requests" is enabled

### Version check failing
- Verify the `boundless-xyz/boundless` repository has releases
- Check that `snippets/release-version.mdx` has the correct format

### Build failing
- Ensure Bun setup is working correctly
- Check that all script files exist in `scripts/` directory
- Verify file paths in `FILES_TO_PROCESS` are correct
