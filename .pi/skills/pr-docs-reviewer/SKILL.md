---
name: pr-docs-reviewer
description: Review documentation PRs for style consistency. Use when a PR has been opened on the docs repo, when asked to review a PR, or when checking documentation changes for style issues. Fetches PRs via gh CLI, analyzes changes against writing style guidelines, and applies fixes.
---

# PR Docs Reviewer

Review documentation pull requests for the Boundless docs codebase (docs.boundless.network). Enforce a writing style that prioritizes clarity, conciseness, and human authenticity over AI-generated patterns.

## Workflow

1. **Fetch the PR**: Use `gh pr view <number> --json files,additions,deletions,body,title` and `gh pr diff <number>` to get the full context.
2. **Analyze changes**: Read each changed file. Compare against the existing documentation style by reading similar files.
3. **Identify violations**: Flag issues (see rules below).
4. **Generate fixes**: For each violation, provide a specific replacement. Do not just flag issues; fix them.
5. **Apply fixes without staging**: Apply all fixes using the edit tool. Do NOT stage changes with `git add`. This lets the user review the diff before committing.
6. **Commit only when requested**: Only stage and commit if the user explicitly asks. Use `gh` commands for committing to the PR branch.

## Output Format

```
## PR #<number>: <title>

### Style Issues Found

**<filename>**
- Line X: <issue type>
  - Before: "<original text>"
  - After: "<fixed text>"
  - Reason: <brief explanation>

### Summary
<one sentence on overall quality and number of issues>

### Ready to commit?
<yes/no with any caveats>
```

## Core Style Rules

### Non-Negotiable

1. **No em-dashes (---)**: Replace with semicolons, commas, or restructure the sentence.
2. **Conciseness**: Cut unnecessary words. Every sentence earns its place.
3. **No intensifiers**: Remove "very", "really", "extremely", "incredibly", "highly", "significantly" unless they add genuine meaning.
4. **Short sentences, single ideas**: Break complex ideas into digestible pieces.
5. **Active voice**: "The server validates the request" not "the request is validated by the server." Imperative mood for instructions.
6. **No filler phrases**: Cut "It's important to note that", "It should be mentioned that", "In order to", "Basically", "Essentially".
7. **No over-summarization**: No "Here's what we'll cover" + bullet list + content + "In summary" + another list. Present information once.

### Tone

- Soft, formal. Professional but not stiff.
- No casual language, jokes, or overly enthusiastic phrasing.
- No exclamation marks unless genuinely warranted.
- Write for comprehension; many readers are non-native English speakers.

### Structure Preferences

- **Bottom-up explanations**: Start with simple, foundational concepts and build toward complexity.
- **Prose-first**: Use lists, tables, and diagrams only when they genuinely aid comprehension.
- **Terminology**: Define terms inline on first use in parentheses: "The zkVM (zero-knowledge virtual machine) executes..."
- **External references**: Use callout boxes (`<Tip>`, `<Note>`, `<Info>`) for external links.
- **Instructions**: Include the "why" alongside commands. "Run `cargo build`; this compiles the guest program."
- **Configuration docs**: Always use tables for configuration options and parameters.

## Words and Phrases to Eliminate

### Hedging
might, could, possibly, perhaps, maybe, tends to, can sometimes, in some cases

### Redundant Phrases
- "in order to" -> "to"
- "the fact that" -> delete or rephrase
- "due to the fact that" -> "because"
- "it is important to note that" -> delete and state the fact
- "basically", "essentially", "fundamentally" -> delete

### Empty Transitions
"Now let's", "Moving on to", "Next up", "With that said", "Having said that", "As mentioned earlier"

### Marketing Speak
powerful, seamless, robust, state-of-the-art, leverage (use "use"), utilize (use "use"), unlock, enable, empower, cutting-edge, game-changing

### Minimizing Words
just, simply, easily, only, obviously, clearly, of course, super, incredibly, extremely

## Patterns to Eliminate

- "Let's dive into..."
- "Here's what you need to know:"
- "In this section, we'll explore..."
- "It's worth noting that..."
- "This is a powerful feature that allows you to..."
- "By leveraging..."
- "Seamlessly integrate..."
- "Robust solution for..."
- Lists of 3+ items where prose would suffice
- Passive constructions: "X is done by Y" instead of "Y does X"

## Style Correction Examples

**Before**: "In order to leverage the powerful capabilities of the zkVM, you might want to consider utilizing the preflight function."
**After**: "Use the preflight function to estimate cycle count before submitting a request."

**Before**: "Now let's move on to discussing how the prover basically handles the request. It's important to note that the prover will simply download the program and execute it."
**After**: "The prover downloads the program and executes it to determine cycle count."

**Before**: "The Boundless Market is a robust, state-of-the-art coordination mechanism that seamlessly connects requestors with provers."
**After**: "The Boundless Market connects requestors with provers."

## Technical Context

- Mintlify documentation site
- Content is MDX files
- Navigation defined in `navigation.yaml`
- Use `bun` for scripts, never npm/yarn/pnpm
- Check `snippets/release-version.mdx` for version references
