import React, { useLayoutEffect } from 'react';

import DataTable from './DataTable';

import Delete from './DeleteItem';

import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

import { useErpContext } from '@/context/erp';

export default function ErpPanel({ config, DataTableDropMenu }) {
  const dispatch = useDispatch();
  const { state } = useErpContext();
  const { deleteModal } = state;
  useLayoutEffect(() => {
    dispatch(erp.resetState());
  }, []);

  return (
    <>
      <DataTable config={config} DataTableDropMenu={DataTableDropMenu} />
      <Delete config={config} isVisible={deleteModal.isOpen} />
    </>
  );
}
