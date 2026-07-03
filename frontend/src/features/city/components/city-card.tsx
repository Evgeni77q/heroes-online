import { CityCardData } from "../types/city.types";
import { formatProductionRate, formatResourceAmount } from "@/features/resources";

const sectionStyle = {
  marginTop: "24px",
  display: "grid",
  gap: "8px",
} as const;

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "16px",
} as const;

function ResourceRows({
  values,
  formatValue,
}: {
  values: CityCardData["storage"];
  formatValue: (value: number) => string;
}) {
  return (
    <>
      <div style={rowStyle}>
        <span>Wood</span>
        <span>{formatValue(values.wood)}</span>
      </div>
      <div style={rowStyle}>
        <span>Stone</span>
        <span>{formatValue(values.stone)}</span>
      </div>
      <div style={rowStyle}>
        <span>Gold</span>
        <span>{formatValue(values.gold)}</span>
      </div>
      <div style={rowStyle}>
        <span>Food</span>
        <span>{formatValue(values.food)}</span>
      </div>
    </>
  );
}

export function CityCard({ city }: { city: CityCardData }) {
  return (
    <section style={sectionStyle}>
      <h2>{city.name}</h2>
      <p>Town Hall Lv.{city.level}</p>

      <div>
        <h3>Population</h3>
        <p>{city.population}</p>
      </div>

      <div>
        <h3>Storage</h3>
        <ResourceRows values={city.storage} formatValue={formatResourceAmount} />
      </div>

      <div>
        <h3>Production</h3>
        <ResourceRows values={city.production} formatValue={formatProductionRate} />
      </div>
    </section>
  );
}
