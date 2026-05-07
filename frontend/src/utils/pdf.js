import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

export const PDF_PAPER_SIZES = ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'];

export const buildPdfDownloadUrl = (entity, id, paperSize = 'A4') =>
  `${DOWNLOAD_BASE_URL}${entity}/${entity}-${id}.pdf?paperSize=${encodeURIComponent(paperSize)}`;
