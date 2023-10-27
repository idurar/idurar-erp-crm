import React from 'react';

import { EyeOutlined } from '@ant-design/icons';
import DataTable from '@/components/DataTable';

export default function AdminCrudModule({ config }) {
  return (
    <DataTable
      config={config}
      extra={[
        {
          label: 'Update Password',
          key: 'updatePassword',
          icon: <EyeOutlined />,
        },
      ]}
    />
  );
}
