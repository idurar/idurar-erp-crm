import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import invoiceFollowNum from './invoiceFollowNum';

export default function useInvoiceFollowNum() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadFormattedInvoices = async () => {
      try {
        const { formattedInvoices } = await invoiceFollowNum();
        dispatch(erp.invoiceFollowNum({ date: formattedInvoices }));
      } catch (error) {
        console.error('Error while fetching formatted invoices:', error);
      }
    };

    loadFormattedInvoices();
  }, []);
}
