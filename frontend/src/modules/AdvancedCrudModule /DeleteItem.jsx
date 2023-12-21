import { useEffect, useState } from 'react';
import { Modal } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { adavancedCrud } from '@/redux/adavancedCrud/actions';
import { useAdavancedCrudContext } from '@/context/adavancedCrud';
import { selectDeletedItem } from '@/redux/adavancedCrud/selectors';
import { valueByString } from '@/utils/helpers';

export default function Delete({ config }) {
  let {
    entity,
    deleteModalLabels,
    deleteMessage = 'Do you want delete : ',
    modalTitle = 'Remove Item',
  } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem);
  const { state, adavancedCrudContextAction } = useAdavancedCrudContext();
  const { deleteModal } = state;
  const { modal } = adavancedCrudContextAction;
  const [displayItem, setDisplayItem] = useState('');

  useEffect(() => {
    if (isSuccess) {
      modal.close();
      const options = { page: 1, items: 10 };
      dispatch(adavancedCrud.list({ entity, options }));
    }
    if (current) {
      let labels = deleteModalLabels.map((x) => valueByString(current, x)).join(' ');

      setDisplayItem(labels);
    }
  }, [isSuccess, current]);

  const handleOk = () => {
    const id = current._id;
    dispatch(adavancedCrud.delete({ entity, id }));
    modal.close();
    dispatch(adavancedCrud.list({ entity }));
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={modalTitle}
      open={deleteModal.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>
        {deleteMessage}
        {displayItem}
      </p>
    </Modal>
  );
}
