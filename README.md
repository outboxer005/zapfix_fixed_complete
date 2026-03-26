# Zapfix

Zapfix is a Bun-based monorepo containing the core CLI/runtime, app UI packages, desktop shell, shared SDK/UI/util packages, and project scripts.

This repository now uses a single README for setup and installation.

## Prerequisites

- Bun 1.3.11 (required)
- Git
- Node.js 20+ (recommended for tooling compatibility)

For desktop development only:
- Rust toolchain
- Tauri prerequisites for your OS

## Clone

```bash
git clone https://github.com/outboxer005/zapfix_fixed_complete.git
cd zapfix_fixed_complete
```

## Install Dependencies

```bash
bun install
```

## Run The Project

### 1. Core Dev Runtime

Runs the main runtime from the monorepo root:

```bash
bun run dev
```

### 2. Desktop App (Tauri)

```bash
bun run dev:desktop
```

### 3. Type Checking

```bash
bun run typecheck
```

## Useful Package-Level Commands

If you need to run individual package apps:

```bash
# App package (Vite)
bun --cwd packages/app dev

# Desktop package frontend (Vite only)
bun --cwd packages/desktop dev

# Desktop package full build
bun --cwd packages/desktop build
```

## Build

For package-specific builds, run inside package folders.

Example:

```bash
bun --cwd packages/opencode build
```

## Troubleshooting

- If dependency installation fails, ensure Bun version is exactly 1.3.11.
- If desktop dev fails, verify Rust + Tauri prerequisites are installed.
- If type errors appear after pulling changes, run a clean install:

```bash
rm -rf node_modules
bun install
bun run typecheck
```

## Notes

- The repository uses workspaces under packages/.
- Root test script is intentionally non-runnable by default.
