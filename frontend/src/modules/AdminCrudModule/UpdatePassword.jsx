import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import { Button, Form, Input } from 'antd';

import Loading from '@/components/Loading';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';

import useLanguage from '@/locale/useLanguage';

export default function UpdatePassword({ config }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { current } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();

  const [form] = Form.useForm();

  const { onFetch, result, isLoading, isSuccess } = useOnFetch();

  const handelSubmit = (fieldsValue) => {
    const entity = 'admin/password-update/' + current._id;
    const updateFn = async () => {
      return await request.patch({ entity, jsonData: fieldsValue });
    };
    const callback = updateFn();
    onFetch(callback);
  };

  /////

  const { readBox } = crudContextAction;

  const showCurrentRecord = () => {
    readBox.open();
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'update' }));
    }
  }, [isSuccess]);

  const { isAdvancedBoxOpen } = state;

  const show = isAdvancedBoxOpen
    ? { display: 'block', opacity: 1 }
    : { display: 'none', opacity: 0 };

  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <h3>{translate('Update Password')}</h3>
        <div className="space10"></div>
        <Form form={form} layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            label={translate('New Password')}
            name="password"
            rules={[
              {
                required: true,
                // len: 8,
              },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit">
              {translate('Save')}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            <Button onClick={showCurrentRecord}>{translate('Cancel')}</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
