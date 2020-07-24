export function getPercentage(used: number, total: number): number {
  return Math.floor((used / total) * 100);
}
