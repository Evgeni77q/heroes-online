import { DashboardData } from "../types/dashboard.types";

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto auto",
  gap: "16px",
} as const;

export function ResourcesPanel({ data }: { data: DashboardData }) {
  const { resources, city } = data;

  return (
    <section style={{ marginTop: "24px", display: "grid", gap: "8px" }}>
      <h2>Resources</h2>

      <div style={rowStyle}>
        <span>Wood</span>
        <span>{resources.wood}</span>
        <span>(+{city.production.wood}/min)</span>
      </div>
      <div style={rowStyle}>
        <span>Stone</span>
        <span>{resources.stone}</span>
        <span>(+{city.production.stone}/min)</span>
      </div>
      <div style={rowStyle}>
        <span>Gold</span>
        <span>{resources.gold}</span>
        <span>(+{city.production.gold}/min)</span>
      </div>
      <div style={rowStyle}>
        <span>Food</span>
        <span>{resources.food}</span>
        <span>(+{city.production.food}/min)</span>
      </div>
    </section>
  );
}
