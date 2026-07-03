import { BuildingStatus, BuildingView } from "../types/building.types";

const STATUS_LABELS: Record<BuildingStatus, string> = {
  [BuildingStatus.Idle]: "Idle",
  [BuildingStatus.Upgrading]: "Upgrading",
  [BuildingStatus.Locked]: "Locked",
};

export function BuildingStatusView({ building }: { building: BuildingView }) {
  return <p>Status: {STATUS_LABELS[building.status]}</p>;
}
