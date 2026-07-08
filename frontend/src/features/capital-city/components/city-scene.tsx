"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CITY_SCENE_GROUND_FALLBACK_SRC } from "../config/building-visual.config";
import {
  CityConstructorField,
  CityConstructorPlacement,
} from "../types/city-constructor.types";
import { BuildPlot, CitySceneMode } from "./build-plot";
import { CastleMarker } from "./castle-marker";
import { CityRoads } from "./city-roads";

interface CitySceneProps {
  field: CityConstructorField;
  placementsBySlot: Map<number, CityConstructorPlacement>;
  cityName: string;
  townHallLevel: number;
  mode: CitySceneMode;
  selectedSlotIndex: number | null;
  isPending: boolean;
  onSelectSlot: (slotIndex: number) => void;
  onDropBuilding: (buildingId: string, slotIndex: number) => void;
  onBuildingClick?: (placement: CityConstructorPlacement) => void;
  onCastleClick?: () => void;
}

function depthZIndex(y: number, base = 10): number {
  return base + Math.round(y);
}

export function CityScene({
  field,
  placementsBySlot,
  cityName,
  townHallLevel,
  mode,
  selectedSlotIndex,
  isPending,
  onSelectSlot,
  onDropBuilding,
  onBuildingClick,
  onCastleClick,
}: CitySceneProps) {
  const isEditMode = mode === "edit";
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = viewportRef.current;

    if (!node) {
      return;
    }

    const updateScale = () => {
      setScale(node.clientWidth / field.width);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(node);

    return () => observer.disconnect();
  }, [field.width]);

  const sortedPlots = useMemo(
    () => [...field.plots].sort((left, right) => left.y - right.y),
    [field.plots],
  );

  const castleCenterY = field.castle.y + field.castle.height / 2;
  const castleZIndex = depthZIndex(castleCenterY, 200);

  const occupiedPlotIndices = useMemo(() => {
    return new Set(placementsBySlot.keys());
  }, [placementsBySlot]);

  return (
    <section
      aria-label="Поле столицы"
      className="premium-card premium-card--scene"
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: isEditMode
          ? "0 0 0 1px rgba(103,232,249,0.18), 0 24px 60px rgba(2,6,23,0.42)"
          : "0 24px 60px rgba(2,6,23,0.42)",
      }}
    >
      <div
        ref={viewportRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${field.width} / ${field.height}`,
          backgroundColor: "#6b5d4d",
          backgroundImage: `url(${CITY_SCENE_GROUND_FALLBACK_SRC})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "inherit",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,11,24,0.08) 0%, rgba(5,11,24,0.22) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: field.width,
            height: field.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <CityRoads
            field={field}
            occupiedPlotIndices={occupiedPlotIndices}
            mode={mode}
          />

          <CastleMarker
            castle={field.castle}
            cityName={cityName}
            townHallLevel={townHallLevel}
            sceneWidth={field.width}
            sceneHeight={field.height}
            zIndex={castleZIndex}
            isEditMode={isEditMode}
            onClick={onCastleClick}
          />

          {sortedPlots.map((plot) => (
            <BuildPlot
              key={plot.index}
              plot={plot}
              placement={placementsBySlot.get(plot.index)}
              mode={mode}
              sceneWidth={field.width}
              sceneHeight={field.height}
              selected={selectedSlotIndex === plot.index}
              isPending={isPending}
              zIndex={depthZIndex(plot.y, 240)}
              onSelect={onSelectSlot}
              onDropBuilding={onDropBuilding}
              onBuildingClick={onBuildingClick}
            />
          ))}
        </div>

        {isEditMode ? (
          <div aria-hidden className="premium-scene-hint">
            Edit mode — choose a scenic plot. Ideal building hints are suggestions.
          </div>
        ) : null}
      </div>
    </section>
  );
}
