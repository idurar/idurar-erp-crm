import { Select, Tag } from 'antd';
import { generate as uniqueId } from 'shortid';
import { tagColor } from '@/utils/statusTagColor';

export default function SelectTag({ options, defaultValue }) {
  return (
    <Select
      defaultValue={defaultValue}
      style={{
        width: '100%',
      }}
    >
      {options?.map((value) => {
        const option = tagColor(value);
        if (option)
          return (
            <Select.Option key={`${uniqueId()}`} value={option.value}>
              <Tag bordered={false} color={option.color}>
                {translate(option.label)}
              </Tag>
            </Select.Option>
          );
        else
          return (
            <Select.Option key={`${uniqueId()}`} value={value}>
              <Tag bordered={false}>{value}</Tag>
            </Select.Option>
          );
      })}
    </Select>
  );
}
