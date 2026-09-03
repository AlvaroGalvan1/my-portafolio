// The map's base layer. Satellite only, deliberately — the layer picker
// that used to sit above the map (Streets / Satellite / Terrain / Dark) is
// gone: four ways to look at the same empty world was a control panel
// without a job. Imagery is the one that reads as a place rather than a
// diagram, so it's the only one left.
export const SATELLITE_LAYER = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  attribution:
    "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  maxZoom: 19,
} as const;
