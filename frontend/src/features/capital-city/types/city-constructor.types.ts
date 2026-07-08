export interface CitySceneRoadHub {
  x: number;
  y: number;
}

export type CityScenePlotRing = "civic" | "military" | "economy" | "outer";

export interface CityScenePlot {
  index: number;
  placeName: string;
  ring: CityScenePlotRing;
  recommendedFor: string[];
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CitySceneCastle {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export interface CityConstructorField {
  width: number;
  height: number;
  slotCount: number;
  castle: CitySceneCastle;
  roadHub: CitySceneRoadHub;
  plots: CityScenePlot[];
}

export interface CityConstructorPlacement {
  buildingId: string;
  slotIndex: number;
  type: string;
  label: string;
  level: number;
}

export interface CityConstructorView {
  cityId: string;
  cityName: string;
  townHallLevel: number;
  field: CityConstructorField;
  placements: CityConstructorPlacement[];
  unplaced: CityConstructorPlacement[];
}
