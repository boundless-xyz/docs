#!/usr/bin/env bun
/**
 * Build script for Mintlify docs.json
 * 
 * Merges docs.base.json + navigation.yaml → docs.json
 * 
 * Usage:
 *   bun run build-docs.ts
 *   bun run build-docs.ts --watch
 */

import { watch } from "fs";
import { readFile, writeFile } from "fs/promises";
import { parse as parseYAML } from "yaml"; // Use the 'yaml' package for better parsing
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Config paths - adjust as needed
const CONFIG = {
  baseJson: join(projectRoot, "docs.base.json"),
  navYaml: join(projectRoot, "navigation.yaml"),
  output: join(projectRoot, "docs.json"),
};

// Type definitions for better IDE support
interface NavGroup {
  group: string;
  icon?: string;
  expanded?: boolean;
  pages: (string | NavGroup)[];
}

interface NavAnchor {
  anchor: string;
  icon?: string;
  href?: string;
  pages?: string[];
  groups?: NavGroup[];
}

interface NavTab {
  tab: string;
  groups?: NavGroup[];
  anchors?: NavAnchor[];
}

interface Navigation {
  tabs?: NavTab[];
  anchors?: NavAnchor[];
  global?: {
    anchors?: NavAnchor[];
  };
}

async function buildDocs() {
  const startTime = performance.now();

  try {
    // Read base config
    const baseText = await readFile(CONFIG.baseJson, "utf8");
    const baseConfig = JSON.parse(baseText);

    // Read and parse navigation YAML
    const yamlText = await readFile(CONFIG.navYaml, "utf8");
    const navigation: Navigation = parseYAML(yamlText);

    // Validate navigation structure
    validateNavigation(navigation);

    // Build final navigation object
    const finalNav: Record<string, unknown> = {};

    // Handle tabs
    if (navigation.tabs) {
      finalNav.tabs = navigation.tabs;
    }

    // Handle root-level anchors (alternative to tabs)
    if (navigation.anchors) {
      finalNav.anchors = navigation.anchors;
    }

    // Handle global config (anchors that appear everywhere)
    if (navigation.global) {
      finalNav.global = navigation.global;
    }

    // Merge into base config
    baseConfig.navigation = finalNav;

    // Write output with pretty formatting
    const output = JSON.stringify(baseConfig, null, 2);
    await writeFile(CONFIG.output, output);

    const elapsed = (performance.now() - startTime).toFixed(2);
    console.log(`✅ Generated ${CONFIG.output} (${elapsed}ms)`);
    
    // Print navigation summary
    printNavSummary(navigation);

  } catch (error) {
    console.error("❌ Build failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function validateNavigation(nav: Navigation) {
  const errors: string[] = [];

  if (nav.tabs) {
    for (const tab of nav.tabs) {
      if (!tab.tab) {
        errors.push("Tab missing 'tab' name");
      }
      if (!tab.groups && !tab.anchors && !tab.pages) {
        errors.push(`Tab "${tab.tab}" has no groups, anchors, or pages`);
      }
    }
  }

  if (nav.anchors) {
    for (const anchor of nav.anchors) {
      if (!anchor.anchor) {
        errors.push("Anchor missing 'anchor' name");
      }
      if (!anchor.href && !anchor.pages && !anchor.groups) {
        errors.push(`Anchor "${anchor.anchor}" needs href, pages, or groups`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Navigation validation failed:\n  - ${errors.join("\n  - ")}`);
  }
}

function printNavSummary(nav: Navigation) {
  const parts: string[] = [];

  if (nav.tabs) {
    parts.push(`${nav.tabs.length} tabs`);
  }
  if (nav.anchors) {
    parts.push(`${nav.anchors.length} root anchors`);
  }
  if (nav.global?.anchors) {
    parts.push(`${nav.global.anchors.length} global anchors`);
  }

  if (parts.length > 0) {
    console.log(`   📚 ${parts.join(", ")}`);
  }
}

// Watch mode
if (process.argv.includes("--watch")) {
  console.log("👀 Watching for changes...\n");
  
  await buildDocs();
  
  for (const file of [CONFIG.baseJson, CONFIG.navYaml]) {
    watch(file, async (event) => {
      if (event === "change") {
        console.log(`\n🔄 ${file} changed`);
        await buildDocs();
      }
    });
  }
} else {
  await buildDocs();
}