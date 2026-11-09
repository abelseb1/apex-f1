import Image from "next/image";
import type { Driver } from "@/lib/api/types";
import type { CSSProperties } from "react";

export function DriverPhoto({ driver, sizes, priority = false }: { driver: Driver; sizes: string; priority?: boolean }) {
  const name = `${driver.givenName} ${driver.familyName}`;
  if (!driver.headshotUrl) return null;
  if (driver.portraitStyle !== "cutout") return <Image src={driver.headshotUrl} alt={`${name}, ${driver.constructorName ?? "Formula 1"}`} fill sizes={sizes} priority={priority} className="object-cover" />;
  const isRacingBulls = driver.constructorId === "racing_bulls";
  const flag = driver.nationality === "Brazilian" ? "br" : driver.nationality === "Japanese" ? "jp" : undefined;
  return <div className="driver-photo" style={{ "--portrait-base": isRacingBulls ? "#0032b9" : "#667175", "--portrait-accent": isRacingBulls ? "#6692ff" : "#dee1e2" } as CSSProperties}>
    <div className="driver-photo-texture" aria-hidden="true" />
    <div className={`driver-photo-figure${driver.id === "ryo_hirakawa" ? " driver-photo-figure-torso" : ""}`}>
      <Image src={driver.headshotUrl} alt={name} fill sizes={sizes} priority={priority} className="object-contain object-top" />
    </div>
    <div className="driver-photo-identity">
      <p>{driver.givenName}</p>
      <p className="font-black">{driver.familyName}</p>
      <p className="driver-photo-team">{isRacingBulls ? "Racing Bulls" : driver.constructorName}</p>
      <p className="driver-photo-number">{driver.permanentNumber ?? "--"}</p>
    </div>
    {flag ? <Image src={`/f1-assets/flags/${flag}.png`} alt={`${driver.nationality} flag`} width={80} height={54} className="driver-photo-flag" /> : null}
  </div>;
}
