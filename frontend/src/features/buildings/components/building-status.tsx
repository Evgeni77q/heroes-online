import { BuildingStatus, BuildingView } from "../types/building.types";

const STATUS_LABELS: Record<BuildingStatus, string> = {
  [BuildingStatus.Idle]: "Idle",
  [BuildingStatus.Upgrading]: "Upgrading",
  [BuildingStatus.Locked]: "Locked",
};

function formatFinishAt(finishAt: string): string {
  return new Date(finishAt).toLocaleString();
}

export function BuildingStatusView({ building }: { building: BuildingView }) {
  return (
    <div>
      <p>Status: {STATUS_LABELS[building.status]}</p>
      {building.status === BuildingStatus.Upgrading && building.finishAt ? (
        <p>Finishes: {formatFinishAt(building.finishAt)}</p>
      ) : null}
    </div>
  );
}
