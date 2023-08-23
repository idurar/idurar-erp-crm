import React from 'react';
import { Tag, Row, Col } from 'antd';

import { DashboardLayout } from '@/layout';
import RecentTable from '@/components/RecentTable';
import Analytics from '@/components/Dashboard/Analytics';

export default function Dashboard() {
  const dataTableColumns = [
    {
      title: 'N#',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Total',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <DashboardLayout>
      <Analytics />
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Invoices</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
        >
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Quotes</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
