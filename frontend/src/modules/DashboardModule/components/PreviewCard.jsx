import { Col, Progress, Spin } from 'antd';

const colours = {
  draft: '#595959',
  sent: '#1890ff',
  pending: '#ffa940',
  declined: '#ff4d4f',
  accepted: '#95de64',
  cyan: '#13c2c2',
  purple: '#722ed1',
  expired: '#614700',
};

const defaultStatistics = [
  {
    tag: 'draft',
    value: 0,
  },
  {
    tag: 'pending',
    value: 0,
  },
  {
    tag: 'sent',
    value: 0,
  },
  {
    tag: 'accepted',
    value: 0,
  },
  {
    tag: 'declined',
    value: 0,
  },
  {
    tag: 'expired',
    value: 0,
  },
];

const PreviewState = ({ tag, color, value }) => {
  return (
    <div style={{ color: '#595959', marginBottom: 5 }}>
      <div className="left alignLeft capitalize">{tag}</div>
      <div className="right alignRight">{value} %</div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          '0%': color,
          '100%': color,
        }}
      />
    </div>
  );
};

export default function PreviewCard({
  title = 'Preview',
  statistics = defaultStatistics,
  isLoading = false,
}) {
  const statisticsMap = defaultStatistics.map((defaultStat) => {
    const matchedStat = Array.isArray(statistics)
      ? statistics.find((stat) => stat.tag === defaultStat.tag)
      : null;
    return matchedStat || defaultStat;
  });
  const customSort = (a, b) => {
    const colorOrder = Object.values(colours);
    const indexA = colorOrder.indexOf(a.props.color);
    const indexB = colorOrder.indexOf(b.props.color);
    return indexA - indexB;
  };
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 24 }}
      md={{ span: 8 }}
      lg={{ span: 8 }}
    >
      <div className="pad15">
        <h3
          style={{
            color: '#22075e',
            marginBottom: 15,
          }}
        >
          {title}
        </h3>
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          statisticsMap
            ?.map((status, index) => (
              <PreviewState
                key={index}
                tag={status.tag}
                color={colours[status.tag]}
                value={status?.value}
              />
              // sort by colours
            ))
            .sort(customSort)
        )}
      </div>
    </Col>
  );
}