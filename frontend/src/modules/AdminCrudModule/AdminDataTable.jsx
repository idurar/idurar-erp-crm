import React from 'react';

import { EyeOutlined } from '@ant-design/icons';
import DataTable from '@/components/DataTable';

import useLanguage from '@/lang/useLanguage';

export default function AdminCrudModule({ config }) {
  const translate = useLanguage();

  return (
    <DataTable
      config={config}
      extra={[
        {
          label: translate('Update Password'),
          key: 'updatePassword',
          icon: <EyeOutlined />,
        },
      ]}
    />
  );
}
