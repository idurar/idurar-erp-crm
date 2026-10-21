import { useCallback, useEffect, useState } from 'react';

import { Row, Col, Card, DatePicker, InputNumber, Segmented, Space, Statistic } from 'antd';
import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import './style.css';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const getStatsData = ({ entity, currency, options = {} }) =>
  request.summary({
    entity,
    options: { currency, ...options },
  });

export default function DashboardModule() {
  const navigate = useNavigate();
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const [overdueDays, setOverdueDays] = useState(7);
  const [revenueType, setRevenueType] = useState('month');
  const [revenueDate, setRevenueDate] = useState(dayjs());

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: revenueResult, isLoading: revenueLoading, onFetch: fetchRevenue } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const fetchClientSummary = useCallback(() => request.summary({ entity: 'client' }), []);
  const { result: clientResult, isLoading: clientLoading } = useFetch(fetchClientSummary);

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency, options: { overdueDays } }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [
    fetchInvoicesStats,
    fetchPayemntsStats,
    fetchQuotesStats,
    money_format_settings.default_currency_code,
    overdueDays,
  ]);

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;
    if (!currency) return;
    fetchRevenue(
      getStatsData({
        entity: 'payment',
        currency,
        options: {
          type: revenueType,
          period: revenueDate.format(revenueType === 'month' ? 'YYYY-MM' : 'YYYY'),
        },
      })
    );
  }, [
    fetchRevenue,
    money_format_settings.default_currency_code,
    revenueDate,
    revenueType,
  ]);

  const dataTableColumns = [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => (status ? translate(status) : status),
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Invoices'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('quote'),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
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

  if (money_format_settings) {
    return (
      <>
        <div className="dashboard-summary-grid">
          <SummaryCard
            title={translate('Invoices')}
            prefix={`${translate('This month')} · ${
              invoiceResult?.change_percentage >= 0 ? '+' : ''
            }${invoiceResult?.change_percentage || 0}%`}
            count={invoiceResult?.count || 0}
            isLoading={invoiceLoading}
            data={invoiceResult?.total}
            onClick={() => navigate('/invoice')}
          />
          <SummaryCard
            title="Angebote"
            prefix={translate('This month')}
            count={quoteResult?.count || 0}
            isLoading={quoteLoading}
            data={quoteResult?.total}
            onClick={() => navigate('/quote')}
          />
          <SummaryCard
            title={translate('paid')}
            prefix={translate('This month')}
            count={paymentResult?.count || 0}
            isLoading={paymentLoading}
            data={paymentResult?.total}
            onClick={() => navigate('/payment')}
          />
          <SummaryCard
            title={translate('Unpaid')}
            prefix={translate('Not Paid')}
            isLoading={invoiceLoading}
            data={invoiceResult?.total_undue}
            onClick={() => navigate('/invoice')}
          />
          <SummaryCard
            title="In den nächsten 14 Tagen fällig"
            prefix={`${invoiceResult?.upcoming_due_count || 0} Rechnung(en)`}
            isLoading={invoiceLoading}
            data={invoiceResult?.upcoming_due_total}
            onClick={() => navigate('/invoice')}
          />
          <SummaryCard
            title={`Seit mehr als ${overdueDays} Tagen überfällig`}
            prefix={`${invoiceResult?.overdue_count || 0} Rechnung(en)`}
            isLoading={invoiceLoading}
            data={invoiceResult?.total_overdue}
            onClick={() => navigate('/invoice')}
          />
        </div>
        <div className="space30"></div>
        <Card
          className="whiteBox shadow"
          bordered={false}
          title="Umsatz"
          extra={
            <Space wrap>
              <Segmented
                value={revenueType}
                onChange={setRevenueType}
                options={[
                  { label: 'Monat', value: 'month' },
                  { label: 'Jahr', value: 'year' },
                ]}
              />
              <DatePicker
                value={revenueDate}
                onChange={(value) => setRevenueDate(value || dayjs())}
                picker={revenueType}
                allowClear={false}
                format={revenueType === 'month' ? 'MMMM YYYY' : 'YYYY'}
              />
            </Space>
          }
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} md={8}>
              <Statistic
                title={
                  revenueType === 'month'
                    ? 'Umsatz im ausgewählten Monat'
                    : 'Umsatz im ausgewählten Jahr'
                }
                loading={revenueLoading}
                value={moneyFormatter({
                  amount: revenueResult?.total || 0,
                  currency_code: money_format_settings.default_currency_code,
                })}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Erfasste Zahlungen"
                value={revenueResult?.count || 0}
                loading={revenueLoading}
              />
            </Col>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={2}>
                <span>Überfällig ab</span>
                <InputNumber
                  min={0}
                  max={3650}
                  value={overdueDays}
                  onChange={(value) => setOverdueDays(value ?? 0)}
                  addonAfter="Tagen"
                />
              </Space>
            </Col>
          </Row>
        </Card>
        <div className="space30"></div>
        <Row gutter={[32, 32]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
            <div className="whiteBox shadow" style={{ height: 458 }}>
              <Row className="pad20" gutter={[0, 0]}>
                {statisticCards}
              </Row>
            </div>
          </Col>
          <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <CustomerPreviewCard
              isLoading={clientLoading}
              totalCustomer={clientResult?.total}
              activeCustomer={clientResult?.active}
              activeCustomerCount={clientResult?.activeCount}
              newCustomerCount={clientResult?.newCount}
              topClients={clientResult?.topClients || []}
            />
          </Col>
        </Row>
        <div className="space30"></div>
        <Row gutter={[32, 32]}>
          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
              <h3 style={{ color: 'var(--app-heading)', marginBottom: 5, padding: '0 20px 20px' }}>
                {translate('Recent Invoices')}
              </h3>

              <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
            </div>
          </Col>

          <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
            <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
              <h3 style={{ color: 'var(--app-heading)', marginBottom: 5, padding: '0 20px 20px' }}>
                {translate('Recent Quotes')}
              </h3>
              <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
            </div>
          </Col>
        </Row>
      </>
    );
  } else {
    return <></>;
  }
}
