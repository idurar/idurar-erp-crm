import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const valueAt = (record, dataIndex) => {
  const path = Array.isArray(dataIndex) ? dataIndex : [dataIndex];
  return path.reduce((value, key) => value?.[key], record);
};

const compare = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left ?? '').localeCompare(String(right ?? ''), 'de', {
    numeric: true,
    sensitivity: 'base',
  });
};

export const enhanceTableColumns = (columns) => columns.map((column) => {
  if (!column.dataIndex || column.sorter === false) return column;
  const getColumnValue = (record) => column.filterValue
    ? column.filterValue(record)
    : valueAt(record, column.dataIndex);
  return {
    ...column,
    sorter: column.sorter || ((a, b) => compare(getColumnValue(a), getColumnValue(b))),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#12559B' : undefined }} />,
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8, width: 230 }} onKeyDown={(event) => event.stopPropagation()}>
        <Input.Search
          autoFocus
          allowClear
          value={selectedKeys[0]}
          placeholder={`${column.title || 'Spalte'} filtern`}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedKeys(value ? [value] : []);
            if (!value) confirm({ closeDropdown: false });
          }}
          onSearch={() => confirm()}
          onPressEnter={() => confirm()}
          onClear={() => clearFilters?.({ confirm: true, closeDropdown: false })}
        />
      </div>
    ),
    onFilter: (value, record) => String(getColumnValue(record) ?? '')
      .toLocaleLowerCase('de')
      .includes(String(value).toLocaleLowerCase('de')),
  };
});
