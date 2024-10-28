import { useLayoutEffect } from 'react';

import DataTable from './DataTable';

import Delete from './DeleteItem';

import { useDispatch } from 'react-redux';
import { adavancedCrud } from '@/redux/adavancedCrud/actions';

import { useAdavancedCrudContext } from '@/context/adavancedCrud';

export default function AdavancedCrudPanel({ config, extra }) {
  const dispatch = useDispatch();
  const { state } = useAdavancedCrudContext();
  const { deleteModal } = state;

  const dispatcher = () => {
    dispatch(adavancedCrud.resetState());
  };

  useLayoutEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <DataTable config={config} extra={extra} />
      <Delete config={config} isOpen={deleteModal.isOpen} />
    </>
  );
}
