import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import { Button, Form, Input } from 'antd';

import Loading from '@/components/Loading';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';

export default function UpdatePassword({ config }) {
  const dispatch = useDispatch();
  const { current } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();

  const [form] = Form.useForm();

  const { onFetch, result, isLoading, isSuccess } = useOnFetch();

  const handelSubmit = (fieldsValue) => {
    const entity = 'admin/password-update/' + current._id;
    const updateFn = () => {
      return request.patch({ entity, jsonData: fieldsValue });
    };
    onFetch(updateFn);
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
        <h3>Update Password</h3>
        <div className="space10"></div>
        <Form form={form} layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
                len: 8,
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
              Save
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            <Button onClick={showCurrentRecord}>Cancel</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
