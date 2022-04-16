export function getEnumValues<T>(e: T): any {
  return Object.keys(e).map((key) => e[key]);
}
