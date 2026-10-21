import { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import { useErpContext } from '@/context/erp';
import { selectDeletedItem } from '@/redux/erp/selectors';
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
  const { state, erpContextAction } = useErpContext();
  const { deleteModal } = state;
  const { modal } = erpContextAction;
  const [displayItem, setDisplayItem] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isSuccess) {
      modal.close();
      const options = { page: 1, items: 10 };
      dispatch(erp.list({ entity, options }));
    }
    if (current) {
      let labels = deleteModalLabels.map((x) => valueByString(current, x)).join(' ');

      setDisplayItem(labels);
    }
  }, [current, deleteModalLabels, dispatch, entity, isSuccess, modal]);

  const handleOk = () => {
    if (entity === 'payment' && reason.trim().length < 3) return;
    const id = current._id;
    dispatch(erp.delete({ entity, id, jsonData: entity === 'payment' ? { reason } : undefined }));
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
      {entity === 'payment' && (
        <Input.TextArea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Stornogrund (mindestens 3 Zeichen)"
          status={reason.length > 0 && reason.trim().length < 3 ? 'error' : undefined}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      )}
    </Modal>
  );
}
