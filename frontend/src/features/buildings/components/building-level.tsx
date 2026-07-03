import { BuildingView } from "../types/building.types";

export function BuildingLevel({ building }: { building: BuildingView }) {
  if (building.level === 0) {
    return <p>Locked</p>;
  }

  return <p>Level {building.level}</p>;
}
