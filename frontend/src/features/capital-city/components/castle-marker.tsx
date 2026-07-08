"use client";

import { cityBuildingAsset } from "../config/city-assets.config";
import { ComposedBuilding } from "../composition/composed-building";
import { getCastleComposition } from "../composition/castle-lv1.composition";
import { CitySceneCastle } from "../types/city-constructor.types";

/** @deprecated Use cityBuildingAsset('castle', level) */
export const CASTLE_LEVEL_1_SRC = cityBuildingAsset("castle", 1);

interface CastleMarkerProps {
  castle: CitySceneCastle;
  cityName: string;
  townHallLevel: number;
  sceneWidth: number;
  sceneHeight: number;
  zIndex: number;
  isEditMode: boolean;
  onClick?: () => void;
}

export function CastleMarker({
  castle,
  cityName,
  townHallLevel,
  sceneWidth,
  sceneHeight,
  zIndex,
  isEditMode,
  onClick,
}: CastleMarkerProps) {
  const centerX = castle.x + castle.width / 2;
  const centerY = castle.y + castle.height / 2;
  const composition = getCastleComposition(townHallLevel);

  return (
    <button
      type="button"
      className="premium-castle-shell"
      onClick={() => {
        if (!isEditMode) {
          onClick?.();
        }
      }}
      aria-label={`Замок ${cityName}, Town Hall ур. ${townHallLevel}`}
      title={`${cityName} · Town Hall Lv ${townHallLevel}`}
      style={{
        position: "absolute",
        left: `${(centerX / sceneWidth) * 100}%`,
        top: `${(centerY / sceneHeight) * 100}%`,
        width: composition.footprint.width,
        height: composition.footprint.height,
        transform: `translate(-50%, -50%) rotate(${castle.rotation}deg) scale(${castle.scale})`,
        zIndex,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: isEditMode ? "default" : "pointer",
        filter:
          "drop-shadow(0 20px 32px rgba(2,6,23,0.42)) drop-shadow(0 0 18px rgba(244,199,106,0.18))",
      }}
    >
      <ComposedBuilding
        composition={composition}
        showPartBlueprint={isEditMode}
      />
      <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-8px",
          transform: "translateX(-50%)",
          padding: "6px 10px",
          borderRadius: "999px",
          background: "rgba(7, 14, 27, 0.78)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--premium-text)",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
        }}
      >
        {cityName} · TH {townHallLevel}
      </span>
    </button>
  );
}
