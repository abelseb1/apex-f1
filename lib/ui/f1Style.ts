const teamColors: Record<string, { primary: string; secondary: string; text: string }> = {
  alpine: { primary: "#0090ff", secondary: "#061827", text: "text-[#39a9ff]" },
  "aston martin": { primary: "#006f62", secondary: "#061f1a", text: "text-[#00b99a]" },
  audi: { primary: "#e10600", secondary: "#230908", text: "text-[#ff3b35]" },
  cadillac: { primary: "#8f9197", secondary: "#1b1c20", text: "text-[#c7c9ce]" },
  ferrari: { primary: "#e10600", secondary: "#320610", text: "text-[#ff2d43]" },
  haas: { primary: "#b6babd", secondary: "#1d1e22", text: "text-[#d4d7da]" },
  "haas f1 team": { primary: "#b6babd", secondary: "#1d1e22", text: "text-[#d4d7da]" },
  mclaren: { primary: "#ff8700", secondary: "#2c1604", text: "text-[#ff8700]" },
  mercedes: { primary: "#00d2be", secondary: "#071f22", text: "text-[#00d2be]" },
  "racing bulls": { primary: "#1e41ff", secondary: "#101538", text: "text-[#6b7cff]" },
  rb: { primary: "#2746ff", secondary: "#101538", text: "text-[#6b7cff]" },
  "rb f1 team": { primary: "#2746ff", secondary: "#101538", text: "text-[#6b7cff]" },
  "red bull": { primary: "#1e41ff", secondary: "#07122f", text: "text-[#5b7cff]" },
  "red bull racing": { primary: "#1e41ff", secondary: "#07122f", text: "text-[#5b7cff]" },
  williams: { primary: "#005aff", secondary: "#071532", text: "text-[#4a8cff]" }
};

const countryCodes: Record<string, string> = {
  argentine: "AR", argentina: "AR",
  australia: "AU", australian: "AU",
  austria: "AT", austrian: "AT",
  brazil: "BR", brazilian: "BR",
  british: "GB", uk: "GB", "united kingdom": "GB",
  canada: "CA", canadian: "CA",
  china: "CN", chinese: "CN",
  dutch: "NL", netherlands: "NL",
  finland: "FI", finnish: "FI",
  france: "FR", french: "FR",
  german: "DE", germany: "DE",
  hungary: "HU", hungarian: "HU",
  italian: "IT", italy: "IT",
  japan: "JP", japanese: "JP",
  mexican: "MX", mexico: "MX",
  miami: "US", "united states": "US", usa: "US", american: "US",
  monaco: "MC", monegasque: "MC",
  "new zealand": "NZ", "new zealander": "NZ",
  "saudi arabia": "SA",
  singapore: "SG",
  spanish: "ES", spain: "ES",
  thai: "TH", thailand: "TH"
};

function flagEmoji(code: string) {
  return [...code.toUpperCase()]
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}

export function teamStyle(name?: string) {
  const key = (name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const exact = teamColors[key];
  if (exact) return exact;

  const fuzzy = Object.entries(teamColors)
    .filter(([candidate]) => candidate.length > 3)
    .sort(([a], [b]) => b.length - a.length)
    .find(([candidate]) => key.includes(candidate));

  return fuzzy?.[1] ?? { primary: "#e10600", secondary: "#1a0b11", text: "text-apex" };
}

export function flagFor(value?: string) {
  const code = countryCodes[(value ?? "").toLowerCase()];
  return code ? flagEmoji(code) : "\u2022";
}
