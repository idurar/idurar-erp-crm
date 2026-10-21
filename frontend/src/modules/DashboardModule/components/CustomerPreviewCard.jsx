import { Divider, Empty, List, Progress, Spin } from 'antd';
import { useMoney } from '@/settings';
import useLanguage from '@/locale/useLanguage';

const chartColors = ['#12559B', '#3287CE', '#87B7DE', '#B9D7EF', '#E8F3FC'];

export default function CustomerPreviewCard({
  isLoading = false,
  totalCustomer = 0,
  activeCustomer = 0,
  activeCustomerCount = 0,
  newCustomerCount = 0,
  topClients = [],
}) {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const revenueClients = topClients.filter((client) => Number(client.revenue) > 0);
  const totalRevenue = revenueClients.reduce((sum, client) => sum + Number(client.revenue), 0);
  const chartClients = revenueClients.length > 5
    ? [
        ...revenueClients.slice(0, 4),
        {
          _id: 'other',
          name: 'Weitere',
          revenue: revenueClients.slice(4).reduce((sum, client) => sum + Number(client.revenue), 0),
        },
      ]
    : revenueClients;
  let chartOffset = 0;
  const chartGradient = chartClients.map((client, index) => {
    const start = chartOffset;
    chartOffset += (Number(client.revenue) / totalRevenue) * 100;
    return `${chartColors[index]} ${start}% ${chartOffset}%`;
  }).join(', ');

  return (
    <div className="whiteBox shadow customer-summary-card">
      <h3>{translate('Customers')}</h3>
      {isLoading ? (
        <div className="customer-summary-card__loading"><Spin /></div>
      ) : (
        <>
          <div className="customer-summary-card__metrics">
            <div><strong>{totalCustomer}</strong><span>Gesamt</span></div>
            <div><strong>{newCustomerCount}</strong><span>Neu diesen Monat</span></div>
            <div><strong>{activeCustomerCount}</strong><span>Aktiv</span></div>
          </div>
          <div className="customer-summary-card__revenue">
            <TextRevenueHeading />
            {totalRevenue > 0 ? (
              <div className="customer-summary-card__chart-row">
                <div
                  className="customer-summary-card__donut"
                  role="img"
                  aria-label="Verteilung der Zahlungseingänge nach Kunde"
                  style={{ background: `conic-gradient(${chartGradient})` }}
                >
                  <div><strong>100 %</strong><span>Einnahmen</span></div>
                </div>
                <div className="customer-summary-card__legend">
                  {chartClients.map((client, index) => (
                    <div key={client._id || client.name}>
                      <i style={{ backgroundColor: chartColors[index] }} />
                      <span title={client.name}>{client.name}</span>
                      <strong>{Math.round((Number(client.revenue) / totalRevenue) * 100)} %</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="customer-summary-card__chart-empty">
                <div className="customer-summary-card__donut customer-summary-card__donut--empty">
                  <div><strong>0 %</strong><span>Einnahmen</span></div>
                </div>
                <span className="customer-summary-card__empty-label">Noch keine Zahlungseingänge</span>
              </div>
            )}
          </div>
          <div className="customer-summary-card__activity">
            <div><span>Anteil aktiver Kunden</span><strong>{activeCustomer} %</strong></div>
            <Progress percent={activeCustomer} showInfo={false} strokeColor="#3287CE" trailColor="#E8F3FC" />
          </div>
          <Divider>Top-Kunden nach Zahlungseingang</Divider>
          {topClients.length ? (
            <List
              className="customer-summary-card__list"
              size="small"
              dataSource={topClients.slice(0, 3)}
              renderItem={(client) => (
                <List.Item>
                  <span title={client.name}>{client.name}</span>
                  <strong>{moneyFormatter({ amount: client.revenue })}</strong>
                </List.Item>
              )}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Noch keine Zahlungseingänge" />
          )}
        </>
      )}
    </div>
  );
}

function TextRevenueHeading() {
  return <div className="customer-summary-card__revenue-title">Einnahmen nach Kunde</div>;
}
