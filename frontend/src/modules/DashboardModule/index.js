import React from 'react';
import { Tag, Row, Col } from 'antd';

import { DashboardLayout } from '@/layout';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import useReactQuery from '@/hooks/useReactRouter/useReactQuery';

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

function formatCurrency(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function DashboardModule() {
  const queryOptions = {
    staleTime:120000
  }
  const { result: invoiceResult, isLoading: invoiceLoading } = useReactQuery(
    ['invoice','summary'],
    () => request.summary({ entity: 'invoice' }),
    queryOptions
  )

  const { result: quoteResult, isLoading: quoteLoading } = useReactQuery(
    ['quote','summary'],
    () => request.summary({ entity: 'quote' }),
    queryOptions
  )

  const { result: offerResult, isLoading: offerLoading } = useReactQuery(
    ['offer','summary'],
    () => request.summary({ entity: 'offer' }),
    queryOptions
  )

  const { result: paymentResult, isLoading: paymentLoading } = useReactQuery(
    ['payment/invoice','summary'],
    () => request.summary({ entity: 'payment/invoice' }),
    queryOptions
  )

  const { result: clientResult, isLoading: clientLoading } = useReactQuery(
    ['client','summary'],
    () => request.summary({ entity: 'client' }),
    queryOptions
  )

  const entityData = [
    {
      result: invoiceResult?.result,
      isLoading: invoiceLoading,
      entity: 'invoice',
    },
    {
      result: quoteResult?.result,
      isLoading: quoteLoading,
      entity: 'quote',
    },
    {
      result: offerResult?.result,
      isLoading: offerLoading,
      entity: 'offer',
    },
    {
      result: paymentResult?.result,
      isLoading: paymentLoading,
      entity: 'payment',
    },
  ];

  const cards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    if (entity === 'offer') return null;

    return (
      <SummaryCard
        key={index}
        title={data?.entity === 'paymentInvoice' ? 'Payment' : data?.entity}
        tagColor={
          data?.entity === 'invoice' ? 'cyan' : data?.entity === 'quote' ? 'purple' : 'green'
        }
        prefix={'This month'}
        isLoading={isLoading}
        tagContent={result?.total && formatCurrency(result?.total)}
      />
    );
  });

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    if (entity === 'payment') return null;

    return (
      <PreviewCard
        key={index}
        title={`${data?.entity.charAt(0).toUpperCase() + data?.entity.slice(1)} Preview`}
        isLoading={isLoading}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        {cards}
        <SummaryCard
          title={'Due Balance'}
          tagColor={'red'}
          prefix={'Not Paid'}
          isLoading={invoiceLoading}
          tagContent={
            invoiceResult?.total_undue &&
            `$ ${invoiceResult?.total_undue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ minHeight: '380px', height: '100%' }}>
            <Row className="pad10" gutter={[0, 0]}>
              {statisticCards}
            </Row>
          </div>
        </Col>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.result?.active}
            newCustomer={clientResult?.result?.new}
          />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 12 }}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Invoices</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>

        <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 12 }}>
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
