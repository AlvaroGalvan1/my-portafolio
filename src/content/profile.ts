export const profile = {
  nameLines: ["Álvaro Emilio", "Galván Sandoval"],
  // The only line under the name. Add an `href` here and Hero will need a
  // link element again — left off deliberately, see the note there.
  location: { label: "San Francisco, Mission" },
  photoSrc: "/profile.png", // background-removed PNG — drop the file here
  bio: [
    "Hola! Soy Álvaro de Oaxaca 🌍 I'm passionate about using technology to help society adapt to a changing planet. My work lives at the intersection of GeoAI, satellite data, and people — especially wildfire modeling and the energy transition.",
    "Currently I'm helping build a next-generation wildfire spread model that's lightweight, deployable, and locally actionable — supporting the people on the front lines of wildfire response.",
    "Outside of work: calisthenics, raves, and interdisciplinary approaches to climate action. If you're building tools for a livable future, let's chat 🌸",
  ],
  // TODO: refine — currently just pulled from job bullet points
  skills: [
    "Python",
    "GeoPandas / Shapely / NumPy / SciPy",
    "ArcGIS",
    "Geospatial ML",
    "Statistical Analysis",
  ],
};
