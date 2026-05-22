export const sensorNodes = {
  radar: [
    { id: "RADAR-01", label: "COASTAL",    coords: "28.6°N 077.2°E", range: "250km", status: "operational" as const }, // New Delhi
    { id: "RADAR-02", label: "LONG RANGE", coords: "38.9°N 077.0°W", range: "400km", status: "operational" as const }, // Washington DC
    { id: "RADAR-03", label: "AIRBORNE",   coords: "51.5°N 000.1°W", range: "300km", status: "operational" as const },        // London
  ],
  eoir: [
    { id: "EOIR-01", label: "THERMAL", coords: "35.7°N 139.7°E", range: "32km", status: "operational" as const }, // Tokyo
    { id: "EOIR-02", label: "MWIR",    coords: "48.9°N 002.3°E", range: "28km", status: "operational" as const }, // Paris
  ],
  ais: [
    {
      id: "AIS-COASTAL", label: "SECTOR-BRAVO",
      coords: "28.6°N 077.2°E", vessels: 147, status: "operational" as const,
      route: { from: "28.6°N 077.2°E", to: "12.97°N 077.59°E" }, // Delhi → Bangalore
    },
    {
      id: "AIS-OFFSHORE", label: "SECTOR-CHARLIE",
      coords: "40.7°N 074.0°W", vessels: 89, status: "operational" as const,
      route: { from: "40.7°N 074.0°W", to: "25.76°N 080.19°W" }, // NY → Miami
    },
  ],
  passiveRf: [
    { id: "RF-NODE-ALPHA", coords: "55.8°N 037.6°E", status: "monitoring" as const }, // Moscow
    { id: "RF-NODE-BRAVO", coords: "33.9°S 151.2°E", status: "monitoring" as const }, // Sydney
    { id: "RF-NODE-GAMMA", coords: "19.4°N 099.1°W", status: "monitoring" as const }, // Mexico City
  ],
};

export const trackSummary = {
  total: 247,
  hostile: 3,
  unknown: 11,
  friendly: 233,
};

export const statusBarItems = [
  { label: "RADAR", status: "operational" as const },
  { label: "OPERATIONAL", status: "operational" as const },
  { label: "EO/IR", status: "operational" as const },
  { label: "TRACKING", status: "operational" as const },
  { label: "AIS", status: "degraded" as const },
  { label: "DEGRADED", status: "degraded" as const },
  { label: "PASSIVE RF", status: "operational" as const },
  { label: "ACTIVE", status: "operational" as const },
  { label: "NODE-7", status: "fault" as const },
  { label: "FAULT", status: "fault" as const },
];

export const selectedTarget = {
  id: "HTL-01",
  bearing: "247° T",
  speed: "32.4 KTS",
  coords: "54.88°N 003.92°E",
  classification: "FAST CRAFT",
  time: "00:47:12",
  firstDetect: "14:12:08Z",
  lastUpdate: "14:37:01Z",
  category: "5L / SURF",
};

export const sensorFusion = [
  { label: "RADAR", value: 88, color: "primary" as const },
  { label: "EO/IR", value: 71, color: "success" as const },
  { label: "AIS", value: 12, color: "warning" as const },
  { label: "PASS", value: 45, color: "accent" as const },
  { label: "RF", value: 18, color: "accent" as const },
];

export const intelligenceFeed = [
  {
    time: "14:12:22Z",
    text: "High-speed surface contact HTL-01 on intercept course with exclusion zone. Non-cooperative. AIS silent. RF signature matches SIGINT database: FAST-ATTACK class.",
    source: "RADAR-01 + RF-NODE-ALPHA",
    severity: "high" as const,
  },
  {
    time: "14:15:47Z",
    text: "ELINT: X-band fire control radar emission detected. BRSS-11 bearing 247°. Duration 12s. Possible targeting event.",
    source: "RF-NODE-BRAVO",
    severity: "high" as const,
  },
  {
    time: "14:18:22Z",
    text: "Unknown contact UNK-07 loitering at 75°N 30°E for 22 minutes. No AIS. Low thermal signature. Possible submarine periscope depth.",
    source: "RADAR-01 + EOIR-01",
    severity: "medium" as const,
  },
  {
    time: "14:21:05Z",
    text: "Contact HTL-02 correlation with SIGINT track ZG-1142. Pattern of life analysis: third incursion in 72 hours. Recommend escalate to WATCHCON-2.",
    source: "FUSION ENGINE · CONFIDENCE 91%",
    severity: "medium" as const,
  },
  {
    time: "14:26:37Z",
    text: "RADAR-03 node offline. Coverage gap in sectors FOXTROT-7 through FOXTROT-9. AIS-OFFSHORE operating degraded. Recommend reposition EOIR asset.",
    source: "SYSTEM · NODE-HEALTH MONITOR",
    severity: "low" as const,
  },
];

export const mapContacts = [
  { id: "HTL-01", x: 60, y: 55, speed: "32kts", type: "hostile" as const },
  { id: "HTL-02", x: 55, y: 48, speed: "18kts", type: "hostile" as const },
  { id: "UNK-07", x: 65, y: 32, speed: "7kts", type: "unknown" as const },
  { id: "UNK-12", x: 52, y: 72, speed: "5kts", type: "unknown" as const },
  { id: "HMS ARGYLL", x: 46, y: 57, speed: "", type: "friendly" as const, label: "HMS ARGYLL" },
  { id: "HMS DAUNTLESS", x: 36, y: 64, speed: "", type: "friendly" as const, label: "HMS DAUNTLESS" },
];
