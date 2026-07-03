import { DashboardData } from "../types/dashboard.types";

export function DashboardHeader({ data }: { data: DashboardData }) {
  return (
    <header style={{ display: "grid", gap: "8px" }}>
      <h1>Heroes Online</h1>
      <p>Player: {data.account.username}</p>
      <p>World: {data.player.world}</p>
    </header>
  );
}
