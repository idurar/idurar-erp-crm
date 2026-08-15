/** A package with priceMonthly=0 is the Enterprise/شامل "custom pricing"
 * sentinel — every screen that displays a package price renders that as
 * "حسب الطلب" (by request) instead of "0 ر.ي" so it reads correctly. */
export function formatPackagePrice(priceMonthly: number): string {
  if (priceMonthly <= 0) return "حسب الطلب";
  return `${priceMonthly.toLocaleString("en-US")} ر.ي`;
}
