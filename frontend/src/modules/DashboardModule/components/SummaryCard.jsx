import { Tag, Divider, Row, Col, Spin,Tooltip } from 'antd';

export default function AnalyticSummaryCard({
  title,
  tagContent,
  tagColor,
  prefix,
  isLoading = false,
}) {
  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <div className="whiteBox shadow" style={{ color: '#595959', fontSize: 13, height: '106px' }}>
        <div className="pad15 strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: '#22075e', marginBottom: 0, textTransform: 'capitalize' }}>
            {title}
          </h3>
        </div>
        <Divider style={{ padding: 0, margin: 0 }}></Divider>
        <div className="pad15">
          <Row gutter={[0, 0]}>
            <Col className="gutter-row" span={11} style={{ textAlign: 'left' }}>
              <div className="left">{prefix}</div>
            </Col>
            <Col className="gutter-row" span={2}>
              <Divider
                style={{
                  padding: '10px 0',
                  justifyContent: 'center',
                }}
                type="vertical"
              ></Divider>
            </Col>
            <Col
              className="gutter-row"
              span={11}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <Spin />
              ) : (
                <Tooltip title={tagContent}>
                  <Tag
                    color={tagColor}
                    style={{
                      margin: '0 auto',
                      justifyContent: 'center',
                      maxWidth: '110px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {tagContent ? tagContent : '$0.00'}
                  </Tag>
                </Tooltip>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
}
