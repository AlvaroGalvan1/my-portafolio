import type { NextRequest } from "next/server";

// Proxies WMS GetMap tile requests to LANDFIRE's GeoServer. This exists
// because Chromium's Opaque Response Blocking (ORB) blocks the upstream
// response outright (net::ERR_BLOCKED_BY_ORB) even though it's a valid
// `Content-Type: image/png` with `Access-Control-Allow-Origin: *` — curl
// gets a perfectly good PNG for the identical request, so it's something
// about how their Apache/GeoServer stack shapes the response that trips
// Chromium's sniffing heuristics, not a real CORS/type problem. Re-serving
// the same bytes from our own origin with clean headers sidesteps it.
//
// Locked to one layer — this is a workaround for that one broken response,
// not a general-purpose image proxy.
const UPSTREAM = "https://edcintl.cr.usgs.gov/geoserver/landfire/ows";
const ALLOWED_LAYER = "LF2024_EVC_CONUS";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.search);
  if (params.get("layers") !== ALLOWED_LAYER) {
    return new Response("Forbidden", { status: 403 });
  }
  params.set("service", "WMS");
  params.set("request", "GetMap");

  let upstream: Response;
  try {
    upstream = await fetch(`${UPSTREAM}?${params.toString()}`);
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
