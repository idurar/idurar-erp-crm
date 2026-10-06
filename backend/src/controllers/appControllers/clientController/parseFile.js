const ExcelJS = require('exceljs');
const { Readable } = require('stream');

const cellText = (v) => {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object') {
    if (v.richText) return v.richText.map((t) => t.text).join('').trim();
    if (v.text) return String(v.text).trim();
    if (v.result !== undefined) return String(v.result).trim();
  }
  return String(v).trim();
};

module.exports = async (file) => {
  const name = file.originalname.toLowerCase();
  const wb = new ExcelJS.Workbook();

  if (name.endsWith('.csv')) await wb.csv.read(Readable.from(file.buffer));
  else if (name.endsWith('.xlsx')) await wb.xlsx.load(file.buffer);
  else throw new Error('Unsupported file type. Use .csv or .xlsx');

  const ws = wb.worksheets[0];
  if (!ws) return [];

  const headers = [];
  ws.getRow(1).eachCell((cell, col) => {
    headers[col] = cellText(cell.value).toLowerCase();
  });

  const rows = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const obj = {};
    headers.forEach((h, col) => {
      if (h) obj[h] = cellText(row.getCell(col).value);
    });
    if (Object.values(obj).some(Boolean)) rows.push(obj);
  });
  return rows;
};