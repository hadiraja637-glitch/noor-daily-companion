# Noor v15 error-only repair

No UI, content, feature, location, audio, or styling changes were made in v15.

Fixes only:
- `npm run dev` now preflights required runtime packages and repairs missing packages automatically.
- Vite no longer crashes when port 8443 is already occupied; it selects the next available port instead.
- Existing app source and requested v14 functionality remain unchanged.
