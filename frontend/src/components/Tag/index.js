import { Tag } from 'antd';

export function StatusTag(status = 'draft') {
  let color =
    status === 'draft'
      ? 'cyan'
      : status === 'sent'
      ? 'blue'
      : status === 'accepted'
      ? 'green'
      : status === 'expired'
      ? 'orange'
      : 'red';

  return <Tag color={color}>{status && status.toUpperCase()}</Tag>;
}
