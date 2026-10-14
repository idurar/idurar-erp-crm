import { Select } from 'antd';
import useLanguage from '@/locale/useLanguage';

export default function SelectTag({ options, defaultValue }) {
  const translate = useLanguage();

  return (
    <Select
      defaultValue={defaultValue}
      style={{
        width: '100%',
      }}
    >
      {options?.map((option) => {
        const value = typeof option === 'object' ? option.value : option;
        const label = typeof option === 'object' ? option.label : option;

        return (
          <Select.Option key={value} value={value}>
            {translate(label)}
          </Select.Option>
        );
      })}
    </Select>
  );
}
