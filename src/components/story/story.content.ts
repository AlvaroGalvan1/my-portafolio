import type { Locale } from "@/content/i18n";
import type { MapLabels } from "./story-map";

// Copy for this section, en + es: the four step names (each sits beside its
// company's logo) and the short labels drawn on the map.
export const storyContent: Record<Locale, { steps: [string, string, string, string]; close: string; label: string; map: MapLabels }> = {
  en: {
    steps: ["Grid sensing", "Smoke detection", "Fire simulation", "Remote sensing"],
    close: "That was one fire. Let's build for the rest.",
    label: "One wildfire on a real map: a power line fault, cameras finding the smoke, a fire-spread simulation, a satellite pass, then the Earth",
    map: {
      powerLine: "Power line",
      lineSensor: "Line sensor",
      fault: "Fault",
      camera: "Camera",
      smoke: "Smoke",
      ignition: "Ignition",
      fireFront: "Fire front",
      satellitePass: "Satellite pass",
      fireDetections: "Fire detections",
      day: "DAY",
    },
  },
  es: {
    steps: ["Sensado de la red", "Detección de humo", "Simulación del fuego", "Percepción remota"],
    close: "Ese fue un solo incendio. Construyamos para los demás.",
    label: "Un incendio en un mapa real: una falla en una línea eléctrica, cámaras que encuentran el humo, una simulación de la propagación, un paso de satélite y luego la Tierra",
    map: {
      powerLine: "Línea eléctrica",
      lineSensor: "Sensor de línea",
      fault: "Falla",
      camera: "Cámara",
      smoke: "Humo",
      ignition: "Ignición",
      fireFront: "Frente de fuego",
      satellitePass: "Paso del satélite",
      fireDetections: "Detecciones de fuego",
      day: "DÍA",
    },
  },
};
