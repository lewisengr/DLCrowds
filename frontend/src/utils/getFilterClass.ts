export function getFilterClassFromWaitTime(waitTime: number): string {
  if (waitTime >= 50) return "red-filter";
  if (waitTime >= 25) return "yellow-filter";
  return "green-filter";
}
