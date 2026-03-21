import dayjs from 'dayjs';
import { Switch, Tag, notification } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { countryList } from '@/utils/countryList';
import color from '@/utils/color';

// This function seems fine for a simple read-only data structure.
export const dataForRead = ({ fields }) => {
  const columns = [];
  for (const key in fields) {
    if (fields.hasOwnProperty(key)) {
      const field = fields[key];
      columns.push({
        title: field.label || key,
        dataIndex: field.dataIndex ? field.dataIndex.join('.') : key,
        isDate: field.type === 'date',
      });
    }
  }
  return columns;
};

// Helper to get a random color, useful as a fallback.
function getRandomColor() {
  const colors = [
    'magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green',
    'cyan', 'blue', 'geekblue', 'purple',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 1. Renderers are modularized into a separate helper function for clarity and efficiency.
const getColumnRenderers = ({ translate, moneyFormatter, dateFormat, onUpdate }) => ({
  boolean: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    onCell: () => ({ props: { style: { width: '60px' } } }),
    render: (value, record) => (
      <Switch
        checked={value}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        // 2. The Switch is now functional, calling onUpdate if provided.
        onChange={onUpdate ? (checked) => onUpdate(record._id, { [keyIndex[0]]: checked }) : undefined}
        disabled={!onUpdate}
        onClick={() => {
          if (!onUpdate) {
            notification.info({
              message: 'Read-Only Field',
              description: 'This value can be changed in the edit form.',
              duration: 3,
            });
          }
        }}
      />
    ),
  }),
  date: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (value) => {
      if (!value) return null;
      const date = dayjs(value).format(dateFormat);
      return <Tag bordered={false} color={field.color || 'blue'}>{date}</Tag>;
    },
  }),
  currency: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    onCell: () => ({ style: { textAlign: 'right', whiteSpace: 'nowrap' } }),
    render: (value, record) => moneyFormatter({ amount: value, currency_code: record.currency }),
  }),
  // 3. Consolidated `tag`, `async`, `stringWithColor` into one versatile 'tag' type.
  tag: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (text, record) => {
      if (text === null || text === undefined) return null;
      return <Tag bordered={false} color={field.color || record.color || getRandomColor()}>{text}</Tag>;
    },
  }),
  color: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (text) => {
      const colorInfo = color.find((c) => c.value === text);
      return <Tag bordered={false} color={text}>{colorInfo?.label || text}</Tag>;
    },
  }),
  // 4. Consolidated all 'select' variants into one.
  // Use a new field property `translateItem: true` to translate the label.
  select: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (value) => {
      if (value === null || value === undefined) return null;
      const option = field.options?.find((o) => o.value === value);
      const text = field.translateItem ? translate(option?.label || value) : (option?.label || value);
      if (field.renderAsTag) {
        return <Tag bordered={false} color={option?.color}>{text}</Tag>;
      }
      return text;
    },
  }),
  array: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (items) => {
      if (!Array.isArray(items)) return null;
      return items.map((item, index) => (
        // 5. PERFORMANCE FIX: Use a stable key instead of a random uniqueId on every render.
        <Tag bordered={false} key={`${item}-${index}`} color={field.colors?.[item] || getRandomColor()}>
          {item}
        </Tag>
      ));
    },
  }),
  country: (field, keyIndex) => ({
    title: translate(field.label || keyIndex[0]),
    dataIndex: keyIndex,
    render: (value) => {
      const countryInfo = countryList.find((c) => c.value === value);
      if (!countryInfo) return value;
      return (
        <Tag bordered={false} color={field.color}>
          {countryInfo.icon && `${countryInfo.icon} `}
          {countryInfo.label && translate(countryInfo.label)}
        </Tag>
      );
    },
  }),
});

/**
 * Generates column definitions for an Ant Design Table.
 * @param {object} config - The configuration object.
 * @param {object} config.fields - Defines the columns and their types.
 * @param {function} config.translate - The translation function.
 * @param {function} [config.moneyFormatter] - Function to format currency.
 * @param {string} [config.dateFormat] - The format for dates (e.g., 'DD/MM/YYYY').
 * @param {function} [config.onUpdate] - Handler for in-table edits. Signature: (id, updateObject) => void.
 * @returns {Array} An array of Ant Design Table column definitions.
 */
export function dataForTable({ fields, translate, moneyFormatter, dateFormat, onUpdate }) {
  const columns = [];
  const renderers = getColumnRenderers({ translate, moneyFormatter, dateFormat, onUpdate });

  for (const key in fields) {
    if (!fields.hasOwnProperty(key)) continue;

    const field = fields[key];
    if (field.disableForTable) continue;

    const keyIndex = field.dataIndex || [key];
    const type = field.type || 'string';

    const rendererFn = renderers[type];
    let columnConfig;

    if (rendererFn) {
      columnConfig = rendererFn(field, keyIndex);
    } else {
      // Default column for types without a special renderer (e.g., string, number).
      columnConfig = {
        title: translate(field.label || key),
        dataIndex: keyIndex,
      };
    }
    columns.push(columnConfig);
  }
  return columns;
}
