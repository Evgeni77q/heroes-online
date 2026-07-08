"use client";

import { BUILDING_LABELS, BuildingType } from "@/features/buildings/types/building.types";
import { CityConstructorPlacement, CityScenePlot } from "../types/city-constructor.types";
import { BuildingBlock } from "./building-block";
import { readBuildingDragData } from "./building-block";

export type CitySceneMode = "view" | "edit";

function formatRecommended(types: string[]): string | null {
  if (!types.length) {
    return null;
  }

  return types
    .map((type) => BUILDING_LABELS[type as BuildingType] ?? type)
    .join(", ");
}

interface BuildPlotProps {
  plot: CityScenePlot;
  placement?: CityConstructorPlacement;
  mode: CitySceneMode;
  sceneWidth: number;
  sceneHeight: number;
  selected: boolean;
  isPending: boolean;
  zIndex: number;
  onSelect: (slotIndex: number) => void;
  onDropBuilding: (buildingId: string, slotIndex: number) => void;
  onBuildingClick?: (placement: CityConstructorPlacement) => void;
}

export function BuildPlot({
  plot,
  placement,
  mode,
  sceneWidth,
  sceneHeight,
  selected,
  isPending,
  zIndex,
  onSelect,
  onDropBuilding,
  onBuildingClick,
}: BuildPlotProps) {
  const isEditMode = mode === "edit";
  const recommendedLabel = formatRecommended(plot.recommendedFor);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode) {
      return;
    }

    event.preventDefault();
    const buildingId = readBuildingDragData(event);

    if (!buildingId || isPending) {
      return;
    }

    onDropBuilding(buildingId, plot.index);
  };

  if (!isEditMode && !placement) {
    return null;
  }

  return (
    <div
      role={isEditMode ? "button" : undefined}
      tabIndex={isEditMode ? 0 : undefined}
      onClick={() => {
        if (isEditMode) {
          onSelect(plot.index);
        }
      }}
      onKeyDown={(event) => {
        if (!isEditMode) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(plot.index);
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={
        placement
          ? `${plot.placeName}, ${placement.label}`
          : `Площадка: ${plot.placeName}`
      }
      style={{
        position: "absolute",
        left: `${(plot.x / sceneWidth) * 100}%`,
        top: `${(plot.y / sceneHeight) * 100}%`,
        transform: `translate(-50%, -50%) rotate(${plot.rotation}deg) scale(${plot.scale})`,
        zIndex,
        opacity: isPending ? 0.75 : 1,
        pointerEvents: isEditMode || placement ? "auto" : "none",
      }}
    >
      {placement ? (
        <BuildingBlock
          placement={placement}
          mode={mode}
          selected={selected}
          onClick={() => {
            if (isEditMode) {
              onSelect(plot.index);
              return;
            }

            onBuildingClick?.(placement);
          }}
        />
      ) : (
        <div
          className="premium-plot-empty"
          style={{
            width: 116,
            minHeight: 72,
            padding: "12px 14px",
            borderRadius: "18px",
            border: selected
              ? "2px solid rgba(244, 199, 106, 0.76)"
              : "1px dashed rgba(255,255,255,0.22)",
            background:
              "linear-gradient(180deg, rgba(7, 14, 27, 0.68) 0%, rgba(15, 23, 42, 0.52) 100%)",
            boxShadow: selected
              ? "0 14px 30px rgba(244, 199, 106, 0.18)"
              : "0 10px 24px rgba(2, 6, 23, 0.18)",
            display: "grid",
            gap: "4px",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: selected ? "var(--premium-gold)" : "var(--premium-text-soft)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {selected ? "Selected" : "Plot"}
          </span>
          <span style={{ fontSize: "11px", color: "var(--premium-text)", lineHeight: 1.2 }}>
            {plot.placeName}
          </span>
          <span
            style={{
              fontSize: "9px",
              color: "var(--premium-text-soft)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {plot.ring}
          </span>
          {recommendedLabel ? (
            <span style={{ fontSize: "9px", color: "var(--premium-gold)", fontWeight: 700 }}>
              Ideal: {recommendedLabel}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
