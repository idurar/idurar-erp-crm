import dayjs from 'dayjs';
import { Switch, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { countryList } from '@/utils/countryList';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';

export const dataForRead = ({ fields, translate }) => {
  let columns = [];

  Object.keys(fields).forEach((key) => {
    let field = fields[key];
    columns.push({
      title: field.label ? field.label : key,
      dataIndex: field.dataIndex ? field.dataIndex.join('.') : key,
      isDate: field.type === 'date',
    });
  });

  return columns;
};

export function dataForTable({ fields, translate, moneyFormatter, dateFormat }) {
  let columns = [];

  Object.keys(fields).forEach((key) => {
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
          const date = dayjs(record[key]).format(dateFormat);
          return (
            <Tag bordered={false} color={field.color}>
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
        render: (_, record) =>
          moneyFormatter({ amount: record[key], currency_code: record.currency }),
      },
      async: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={field.color || record[key]?.color || record.color}>
              {text}
            </Tag>
          );
        },
      },
      color: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={text}>
              {color.find((x) => x.value === text)?.label}
            </Tag>
          );
        },
      },
      stringWithColor: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text, record) => {
          return (
            <Tag bordered={false} color={record.color || field.color}>
              {text}
            </Tag>
          );
        },
      },
      tag: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          return (
            <Tag bordered={false} color={field.color}>
              {record[key] && record[key]}
            </Tag>
          );
        },
      },
      selectWithFeedback: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (text, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && translate(record[key])}
              </Tag>
            );
          } else return record[key] && translate(record[key]);
        },
      },
      select: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && record[key]}
              </Tag>
            );
          } else return record[key] && record[key];
        },
      },
      selectWithTranslation: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          if (field.renderAsTag) {
            const selectedOption = field.options.find((x) => x.value === record[key]);

            return (
              <Tag bordered={false} color={selectedOption?.color}>
                {record[key] && translate(record[key])}
              </Tag>
            );
          } else return record[key] && translate(record[key]);
        },
      },
      array: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          return record[key].map((x) => (
            <Tag bordered={false} key={`${uniqueId()}`} color={field.colors[x]}>
              {x}
            </Tag>
          ));
        },
      },
      country: {
        title: field.label ? translate(field.label) : translate(key),
        dataIndex: keyIndex,
        render: (_, record) => {
          const selectedCountry = countryList.find((obj) => obj.value === record[key]);

          return (
            <Tag bordered={false} color={field.color || undefined}>
              {selectedCountry?.icon && selectedCountry?.icon + ' '}
              {selectedCountry?.label && translate(selectedCountry.label)}
            </Tag>
          );
        },
      },
    };

    const defaultComponent = {
      title: field.label ? translate(field.label) : translate(key),
      dataIndex: keyIndex,
    };

    const type = field.type;

    if (!field.disableForTable) {
      Object.keys(component).includes(type)
        ? columns.push(component[type])
        : columns.push(defaultComponent);
    }
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
