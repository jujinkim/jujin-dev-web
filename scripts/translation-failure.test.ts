import assert from "node:assert"
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import test from "node:test"
import { fileURLToPath } from "node:url"

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(scriptsDir, "..")
const translateScript = resolve(scriptsDir, "translate_post.sh")
const syncCommonScript = resolve(scriptsDir, "obsidian_sync_common.sh")

function writeSourcePost(rootDir: string) {
  mkdirSync(resolve(rootDir, "content"), { recursive: true })
  writeFileSync(
    resolve(rootDir, "content", "post.md"),
    `---
title: Failure fixture
lang: ko
publish: true
---
본문
`,
  )
}

function runBash(script: string, rootDir: string) {
  return spawnSync("bash", ["-c", script], {
    cwd: projectDir,
    encoding: "utf8",
    env: {
      ...process.env,
      AGY_BIN: "/bin/false",
      TRANSLATE_SKIP_GIT: "1",
      TEST_ROOT_DIR: rootDir,
    },
  })
}

test("failed agy translation exits non-zero", () => {
  const rootDir = mkdtempSync(resolve(tmpdir(), "jujin-translation-failure-"))
  writeSourcePost(rootDir)

  try {
    const result = runBash(`"${translateScript}" "$TEST_ROOT_DIR/content/post.md" en`, rootDir)

    assert.strictEqual(result.status, 1)
    assert.match(result.stdout, /=== Translation failed ===/)
  } finally {
    rmSync(rootDir, { recursive: true, force: true })
  }
})

test("sync reports translation failure instead of success", () => {
  const rootDir = mkdtempSync(resolve(tmpdir(), "jujin-sync-translation-failure-"))
  writeSourcePost(rootDir)

  try {
    const result = runBash(
      `set -o pipefail
source "${syncCommonScript}"
PROJECT_DIR="$TEST_ROOT_DIR"
TRANSLATION_CACHE_FILE="$TEST_ROOT_DIR/.translation_cache"
if translate_changed_files "$TEST_ROOT_DIR"; then
  exit 1
else
  exit 0
fi`,
      rootDir,
    )

    assert.strictEqual(result.status, 0)
    assert.match(result.stdout, /✗ Translation failed \(continuing anyway\)/)
    assert.match(result.stdout, /Translation processing failed/)
    assert.doesNotMatch(result.stdout, /✓ Translation successful/)
  } finally {
    rmSync(rootDir, { recursive: true, force: true })
  }
})
