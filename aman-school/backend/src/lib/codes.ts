/** Student code format: `{schoolSlug}-{enrollmentYear}-{serial}` e.g. NOOR-2026-00001 */
export function buildStudentCode(schoolSlug: string, enrollmentYear: number, serial: number): string {
  return `${schoolSlug.toUpperCase()}-${enrollmentYear}-${String(serial).padStart(5, "0")}`;
}

export function randomEmployeeCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${n}`;
}

export function randomDriverCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `DRV-${n}`;
}

/** Sequential, never-reused invoice number (BC-6) — e.g. INV-2026-0714. */
export function buildInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(sequence).padStart(4, "0")}`;
}

export function randomDigits(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}
