import { RESOURCE_TYPES } from "../types/resource.types";
import { ResourcesPanelProps } from "../types/resource.types";
import { ResourceItem } from "./resource-item";

const sectionStyle = {
  marginTop: "24px",
  display: "grid",
  gap: "12px",
} as const;

export function ResourcesPanel({ amounts, production }: ResourcesPanelProps) {
  return (
    <section style={sectionStyle}>
      <h2>Resources</h2>

      {RESOURCE_TYPES.map((type) => (
        <ResourceItem
          key={type}
          type={type}
          amount={amounts[type]}
          productionPerMinute={production[type]}
        />
      ))}
    </section>
  );
}
