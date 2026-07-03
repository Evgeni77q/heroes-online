export function formatResourceAmount(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatProductionRate(value: number): string {
  return `+${formatResourceAmount(value)}/min`;
}
