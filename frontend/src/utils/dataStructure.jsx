import dayjs from 'dayjs';
import { Switch, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export const dataForRead = ({ fields, translate }) => {
  let columns = [];

  Object.keys(fields).map((key) => {
    let field = fields[key];
    columns.push({
      title: field.label ? translate(field.label) : translate(key),
      dataIndex: key,
      isDate: field.type === 'date' ? true : false,
    });
  });

  return columns;
};

export function dataForTable({ fields, translate, moneyFormatter }) {
  let columns = [];

  Object.keys(fields).map((key) => {
    let field = fields[key];
    const keyIndex = [key];

    const component = {
      boolean: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        onCell: () => ({
          props: {
            style: {
              width: '60px',
            },
          },
        }),
        render: (_, record) => (
          <Switch
            checked={record[key]}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        ),
      },
      date: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          return dayjs(record[key]).format('DD/MM/YYYY');
        },
      },
      currency: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        onCell: () => {
          return {
            style: {
              textAlign: 'right',
              whiteSpace: 'nowrap',
            },
          };
        },
        render: (_, record) => moneyFormatter({ amount: record[key] }),
      },
      tag: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          let color = field.colors[record[key]];
          return <Tag color={color}>{record[key] && translate(record[key])}</Tag>;
        },
      },
      array: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          return record[key].map((x) => (
            <Tag key={key} color={field.colors[x]}>
              {translate(x)}
            </Tag>
          ));
        },
      },
      default: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
      },
    };

    const type = field.type.toLowerCase();

    ['boolean', 'date', 'currency', 'tag'].includes(type)
      ? columns.push(component[type])
      : columns.push(component.default);
  });
  return columns;
}
