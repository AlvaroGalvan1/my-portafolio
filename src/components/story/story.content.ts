import type { Locale } from "@/content/i18n";
import type { MapLabels } from "./story-map";

// Copy for this section, en + es: the four step names (each sits beside its
// company's logo), one number per step, the "Illustration" tag for the drawn
// fire, and the short labels drawn on the map. The numbers are the ones
// content/experience.ts defended in v1: only use ones I can back up.
type Proof = { value: string; label: string };

export const storyContent: Record<Locale, { steps: [string, string, string, string]; proof: [Proof, Proof, Proof, Proof]; illustration: string; close: string; label: string; map: MapLabels }> = {
  en: {
    steps: ["Grid sensing", "Smoke detection", "Fire simulation", "Remote sensing"],
    proof: [
      { value: "2,000+", label: "grid anomaly alerts investigated" },
      { value: "1,000+", label: "critical assets ranked by camera coverage" },
      { value: "1,000+", label: "fire-spread simulations a day" },
      { value: "Daily", label: "fire-risk updates for tiger reserve teams" },
    ],
    illustration: "Illustration",
    close: "Let's face this climate challenge together.",
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
    proof: [
      { value: "2,000+", label: "alertas de anomalías en la red investigadas" },
      { value: "1,000+", label: "activos críticos clasificados por cobertura de cámaras" },
      { value: "1,000+", label: "simulaciones de propagación al día" },
      { value: "A diario", label: "actualizaciones de riesgo de incendio para las reservas" },
    ],
    illustration: "Ilustración",
    close: "Enfrentemos juntos este reto climático.",
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
