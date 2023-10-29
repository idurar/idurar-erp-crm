import { Tag } from 'antd';
import useLanguage from '@/lang/useLanguage';

export function StatusTag(status = 'draft') {
  const translate = useLanguage();
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

  return <Tag color={color}>{status && translate(status)}</Tag>;
}
