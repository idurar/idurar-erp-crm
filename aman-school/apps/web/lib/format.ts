/** A package with priceMonthly=0 is the Enterprise/شامل "custom pricing"
 * sentinel — mirrors packages/shared-ui/src/format.ts (kept as a small
 * standalone copy here since shared-ui pulls in React Native, which the web
 * app can't depend on). */
export function formatPackagePrice(priceMonthly: number): string {
  if (priceMonthly <= 0) return "حسب الطلب";
  return `${priceMonthly.toLocaleString("en-US")} ر.ي`;
}
