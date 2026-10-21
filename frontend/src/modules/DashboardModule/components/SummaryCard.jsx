import { Tag, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function AnalyticSummaryCard({
  title,
  tagColor,
  data,
  prefix,
  count,
  isLoading = false,
  onClick,
}) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  return (
    <div
      className="whiteBox shadow dashboard-summary-card"
      role={onClick ? 'link' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick();
      }}
    >
      <div className="dashboard-summary-card__title">
        <h3>{title}</h3>
      </div>
      <div className="dashboard-summary-card__body">
        <div className="dashboard-summary-card__label">
          <span>{prefix}</span>
          {Number.isFinite(count) && <strong>{count} Einträge</strong>}
        </div>
        <div className="dashboard-summary-card__value">
          {isLoading ? (
            <Spin size="small" />
          ) : (
            <Tooltip title={data}>
              <Tag color={tagColor}>
                {moneyFormatter({
                  amount: data || 0,
                  currency_code: money_format_settings?.default_currency_code,
                })}
              </Tag>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
