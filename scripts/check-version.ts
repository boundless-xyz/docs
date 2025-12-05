#!/usr/bin/env bun
/**
 * Version check script for Boundless documentation
 *
 * Validates that the release tag in snippets/release-version.mdx matches
 * the latest release from the boundless-xyz/boundless repository
 *
 * Usage:
 *   bun run scripts/check-version.ts
 *   bun run scripts/check-version.ts --auto-update
 *
 * Environment variables:
 *   GITHUB_TOKEN - Optional GitHub personal access token for higher rate limits
 */

import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const BOUNDLESS_REPO = "boundless-xyz/boundless";
const GITHUB_API_BASE = `https://api.github.com/repos/${BOUNDLESS_REPO}`;

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
}

async function githubFetch(endpoint: string): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "boundless-docs-version-checker",
  };

  // Add auth token if available (for higher rate limits)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Not found: ${endpoint}`);
    }
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

async function getLatestRelease(): Promise<GitHubRelease> {
  return await githubFetch("/releases/latest");
}

async function branchExists(branchName: string): Promise<boolean> {
  try {
    await githubFetch(`/branches/${branchName}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the branch name from a release tag and release body
 *
 * For example:
 * - v1.1.2 -> release-1.1 (checks release notes for branch reference)
 * - v1.0.0 -> release-1.0
 * - release-1.1 -> release-1.1 (if already in branch format)
 */
async function extractBranchFromRelease(
  release: GitHubRelease,
): Promise<string> {
  const tag = release.tag_name;

  // Check if release notes contain branch reference
  // Look for patterns like: --branch release-1.1 or "checkout release-1.1"
  const branchMatch = release.body?.match(
    /--branch\s+([^\s]+)|checkout\s+([^\s]+)/,
  );
  if (branchMatch) {
    const extractedBranch = branchMatch[1] || branchMatch[2];
    console.log(`   🔍 Found branch in release notes: ${extractedBranch}`);

    // Verify branch exists
    if (await branchExists(extractedBranch)) {
      return extractedBranch;
    }
    console.log(
      `   ⚠️  Branch ${extractedBranch} from release notes does not exist`,
    );
  }

  // If tag is already in release-X.Y format, use it directly
  if (tag.startsWith("release-")) {
    if (await branchExists(tag)) {
      return tag;
    }
  }

  // Try to convert version tag to branch format
  // v1.1.2 -> release-1.1
  // v1.0.0 -> release-1.0
  const versionMatch = tag.match(/^v?(\d+)\.(\d+)(?:\.\d+)?/);
  if (versionMatch) {
    const major = versionMatch[1];
    const minor = versionMatch[2];
    const branchName = `release-${major}.${minor}`;

    if (await branchExists(branchName)) {
      console.log(`   ✓ Verified branch exists: ${branchName}`);
      return branchName;
    }
    console.log(`   ⚠️  Expected branch ${branchName} does not exist`);
  }

  // Fallback: return the tag as-is and let user handle it
  console.log(
    `   ⚠️  Could not determine branch from tag ${tag}, using tag as-is`,
  );
  return tag;
}

async function getCurrentVersion(): Promise<string> {
  const snippetPath = join(projectRoot, "snippets/release-version.mdx");
  const content = await readFile(snippetPath, "utf8");

  const match = content.match(/releaseTag\s*=\s*"([^"]+)"/);
  if (!match) {
    throw new Error(
      "Could not find releaseTag in snippets/release-version.mdx",
    );
  }

  return match[1];
}

async function updateVersion(newVersion: string): Promise<void> {
  const snippetPath = join(projectRoot, "snippets/release-version.mdx");
  const content = await readFile(snippetPath, "utf8");

  const updatedContent = content.replace(
    /releaseTag\s*=\s*"[^"]+"/,
    `releaseTag = "${newVersion}"`,
  );

  await writeFile(snippetPath, updatedContent);
}

async function checkVersion() {
  const autoUpdate = process.argv.includes("--auto-update");

  try {
    console.log("🔍 Checking version against boundless-xyz/boundless...\n");

    // Fetch latest release from GitHub
    const release = await getLatestRelease();
    const releaseTag = release.tag_name;

    // Extract the actual branch name from the release
    const branchName = await extractBranchFromRelease(release);

    // Get current version from docs
    const currentVersion = await getCurrentVersion();

    console.log(`   📦 Latest release tag: ${releaseTag}`);
    console.log(`   🌿 Branch to use:      ${branchName}`);
    console.log(`   📄 Current docs:       ${currentVersion}`);

    if (currentVersion === branchName) {
      console.log(`\n✅ Version is up to date!`);
      process.exit(0);
    }

    console.log(`\n⚠️  Version mismatch detected!`);
    console.log(`   Release: ${release.name || releaseTag}`);
    console.log(
      `   Published: ${new Date(release.published_at).toLocaleDateString()}`,
    );
    console.log(`   URL: ${release.html_url}`);

    if (autoUpdate) {
      console.log(`\n🔄 Auto-updating to ${branchName}...`);
      await updateVersion(branchName);
      console.log(`✅ Updated snippets/release-version.mdx to ${branchName}`);
      process.exit(0);
    } else {
      console.log(`\n💡 To update automatically, run:`);
      console.log(`   bun run scripts/check-version.ts --auto-update`);
      console.log(
        `\n   Or manually update snippets/release-version.mdx to: "${branchName}"`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "❌ Version check failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

await checkVersion();
