# Security Policy

For any security concerns, please contact us at security@langchain.dev.

## 2026-09-04 — credentials removed
Live credentials were committed to this public repository and have been removed from HEAD and
rotated. They remain reachable in git history; removal from HEAD does not un-leak them.
Configuration secrets belong in the host platform environment variables, never in a committed file.

## 2026-09-04 — credential removed
A live Vercel credential was committed in `.vscode/settings.json` in this public repository. It has been removed from HEAD and scheduled for rotation. It remains reachable in git history; rotation is the fix. Configuration secrets belong in the host platform's environment, never in a committed file.
