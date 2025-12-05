#!/usr/bin/env bun
/**
 * Version injection script for Boundless documentation
 *
 * Replaces {{RELEASE_TAG}} placeholders in MDX files with the actual release version
 * from snippets/release-version.mdx
 *
 * Usage:
 *   bun run scripts/inject-version.ts
 */

import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Files that contain {{RELEASE_TAG}} placeholders
const FILES_TO_PROCESS = [
  "provers/quick-start.mdx",
  "developers/tooling/cli.mdx",
];

async function injectVersion() {
  const startTime = performance.now();

  try {
    // Read the release tag from the snippet file
    const snippetPath = join(projectRoot, "snippets/release-version.mdx");
    const snippetContent = await readFile(snippetPath, "utf8");

    // Extract the release tag value
    const match = snippetContent.match(/releaseTag\s*=\s*"([^"]+)"/);
    if (!match) {
      throw new Error("Could not find releaseTag in snippets/release-version.mdx");
    }

    const releaseTag = match[1];
    console.log(`📌 Found release tag: ${releaseTag}`);

    // Process each file
    let filesProcessed = 0;
    let replacementsMade = 0;

    for (const filePath of FILES_TO_PROCESS) {
      const fullPath = join(projectRoot, filePath);

      try {
        let content = await readFile(fullPath, "utf8");
        const matches = content.match(/\{\{RELEASE_TAG\}\}/g);

        if (matches) {
          content = content.replace(/\{\{RELEASE_TAG\}\}/g, releaseTag);
          await writeFile(fullPath, content);

          filesProcessed++;
          replacementsMade += matches.length;
          console.log(`   ✓ ${filePath} (${matches.length} replacements)`);
        }
      } catch (error) {
        console.warn(`   ⚠ Could not process ${filePath}:`, error instanceof Error ? error.message : error);
      }
    }

    const elapsed = (performance.now() - startTime).toFixed(2);
    console.log(`\n✅ Injected version ${releaseTag} into ${filesProcessed} files (${replacementsMade} replacements, ${elapsed}ms)`);

  } catch (error) {
    console.error("❌ Version injection failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

await injectVersion();
