import React, { useLayoutEffect } from 'react';

import Delete from '@/modules/ErpPanelModule/DeleteItem';

import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';
import PaymentInvoiceDataTable from './PaymentInvoiceDataTable';

export default function PaymentInvoiceERP({ config, DataTableDropMenu }) {
  const dispatch = useDispatch();
  const { state } = useErpContext();
  const { deleteModal } = state;
  useLayoutEffect(() => {
    dispatch(erp.resetState());
  }, []);

  return (
    <>
      <PaymentInvoiceDataTable config={config} DataTableDropMenu={DataTableDropMenu} />
      <Delete config={config} isVisible={deleteModal.isOpen} />
    </>
  );
}
