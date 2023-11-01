import axios from 'axios';

export default async function invoiceFollowNum() {
  const fetchDataForInvoiceFollowNum = async () => {
    const results = [];

    const firstPageResponse = await axios.get('/invoice/list');
    const firstPageData = firstPageResponse.data;

    if (firstPageData.success) {
      results.push(...firstPageData.result);

      const totalPages = firstPageData.pagination.pages;

      for (let page = 2; page <= totalPages; page++) {
        try {
          const nextPageResponse = await axios.get(`/invoice/list?page=${page}`);
          const nextPageData = nextPageResponse.data;

          if (nextPageData.success) {
            results.push(...nextPageData.result);
          } else {
            console.error(`Error fetching data for page ${page}`);
          }
        } catch (error) {
          console.error(`Error fetching data for page ${page}:`, error);
        }
      }
    } else {
      console.error('Error fetching data for the first page');
    }
    return results;
  };

  try {
    const results = await fetchDataForInvoiceFollowNum();

    results.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    const formattedInvoicesArray = results.map((invoice, index) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const dateNum = invoice.number.split('/');
      const num = dateNum[1];

      let formattedNumber;

      if (index < 100) {
        formattedNumber = (+num + 1).toString().padStart(3, '0');
        return `${year + month}/${formattedNumber}`;
      }
      if (index < 1000) {
        formattedNumber = (+num + 1).toString().padStart(2, '0');

        return `${year + month}/${formattedNumber}`;
      } else {
        formattedNumber = (+num + 1).toString();
        return `${year + month}/${formattedNumber}`;
      }
    });

    const formattedInvoices = formattedInvoicesArray[0];

    return { formattedInvoices };
  } catch (error) {
    console.error('Error:', error);
  }
}
