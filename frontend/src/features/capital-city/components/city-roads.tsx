"use client";

import { useMemo } from "react";
import {
  CityConstructorField,
  CityScenePlot,
} from "../types/city-constructor.types";
import type { CitySceneMode } from "./build-plot";

interface CityRoadsProps {
  field: CityConstructorField;
  occupiedPlotIndices: Set<number>;
  mode: CitySceneMode;
}

function roadOpacity(mode: CitySceneMode, hasBuilding: boolean): number {
  if (mode === "view") {
    return hasBuilding ? 0.55 : 0;
  }

  return hasBuilding ? 0.45 : 0.18;
}

function roadWidth(mode: CitySceneMode, plot: CityScenePlot): number {
  if (plot.ring === "outer") {
    return mode === "edit" ? 2 : 2.5;
  }

  if (plot.ring === "economy") {
    return 3.5;
  }

  return 4;
}

export function CityRoads({ field, occupiedPlotIndices, mode }: CityRoadsProps) {
  const hub = field.roadHub ?? { x: 600, y: 658 };

  const roadPlots = useMemo(() => {
    if (mode === "view") {
      return field.plots.filter((plot) => occupiedPlotIndices.has(plot.index));
    }

    return field.plots;
  }, [field.plots, mode, occupiedPlotIndices]);

  return (
    <svg
      aria-hidden
      width={field.width}
      height={field.height}
      viewBox={`0 0 ${field.width} ${field.height}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id="city-road-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 231, 183, 0.68)" />
          <stop offset="100%" stopColor="rgba(120, 74, 31, 0.9)" />
        </linearGradient>
      </defs>
      {roadPlots.map((plot) => {
        const hasBuilding = occupiedPlotIndices.has(plot.index);

        return (
          <line
            key={plot.index}
            x1={hub.x}
            y1={hub.y}
            x2={plot.x}
            y2={plot.y}
            stroke="url(#city-road-gradient)"
            strokeWidth={roadWidth(mode, plot)}
            strokeLinecap="round"
            opacity={roadOpacity(mode, hasBuilding)}
          />
        );
      })}
      <circle cx={hub.x} cy={hub.y} r={12} fill="rgba(244, 199, 106, 0.26)" />
      <circle cx={hub.x} cy={hub.y} r={7} fill="#4a3728" opacity={0.78} />
    </svg>
  );
}
