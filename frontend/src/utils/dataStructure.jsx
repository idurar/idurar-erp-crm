import dayjs from 'dayjs';
import { Switch, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { countryList } from '@/utils/countryList';

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
  const countries = countryList(translate);
  Object.keys(fields).map((key) => {
    let field = fields[key];
    const keyIndex = field.dataIndex ? field.dataIndex : [key];

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
          const date = dayjs(record[key]).format('DD/MM/YYYY');
          return (
            <Tag bordered={false} color={field.color || getRandomColor()}>
              {date}
            </Tag>
          );
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
          return (
            <Tag bordered={false} color={field.color}>
              {record[key] && translate(record[key])}
            </Tag>
          );
        },
      },
      array: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          return record[key].map((x) => (
            <Tag bordered={false} key={key} color={field.colors[x]}>
              {translate(x)}
            </Tag>
          ));
        },
      },
      country: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          const country = countries.find((obj) => obj.value === record[key]);
          return (
            <Tag bordered={false} color={field.color || getRandomColor()}>
              {country.label}
            </Tag>
          );
        },
      },
    };

    const defaultComponent = {
      title: field.label ? translate(field.label) : translate(key),
      dataIndex: keyIndex,
    };

    const type = field.type.toLowerCase();

    Object.keys(component).includes(type)
      ? columns.push(component[type])
      : columns.push(defaultComponent);
  });
  return columns;
}

function getRandomColor() {
  const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  // Generate a random index between 0 and the length of the colors array
  const randomIndex = Math.floor(Math.random() * colors.length);

  // Return the color at the randomly generated index
  return colors[randomIndex];
}
