export function formatLargeNumber(num: number): string {
  if (num > 999_999) {
    const ms = Math.floor(num / 1_000_000);
    return `${ms}M`;
  }
  if (num > 999) {
    const ks = Math.floor(num / 1000);
    return `${ks}K`;
  }
  return num.toString();
}
