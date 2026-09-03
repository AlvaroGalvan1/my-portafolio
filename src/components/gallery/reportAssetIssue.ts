// Single choke point for "a gallery tile is being hidden because its
// content didn't load." Currently just a structured console.error — visible
// in browser devtools immediately, and the one place to wire in a real
// error-reporting service (Sentry, etc.) later without touching every frame
// file. Grep the deployed console for "[gallery:hidden]" to audit what's
// currently missing.
export function reportAssetIssue(info: {
  id: string;
  title: string;
  type: string;
  detail: string;
}) {
  console.error(
    `[gallery:hidden] "${info.title}" (id: ${info.id}, type: ${info.type}) — ${info.detail}`,
  );
}
