import { useDispatch, useSelector } from 'react-redux';

import languages from '@/locale/languages';
import { selectLangCode } from '@/redux/translate/selectors';

// import Notifications from '@/components/Notification';

import { translateAction } from '@/redux/translate/actions';

import useLanguage from '@/locale/useLanguage';

import { Select } from 'antd';

const SelectLanguage = () => {
  const translate = useLanguage();
  const dispatch = useDispatch();

  const langCode = useSelector(selectLangCode);

  return (
    <Select
      showSearch
      placeholder={translate('select language')}
      defaultValue={langCode}
      style={{ width: '120px', float: 'right', marginTop: '5px' }}
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').includes(input.toLowerCase())}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
      }
      onSelect={(value) => {
        dispatch(translateAction.translate(value));
      }}
    >
      {languages.map((language) => (
        <Select.Option
          key={language.value}
          value={language.value}
          label={language.label.toLowerCase()}
          disabled={language.disabled}
        >
          <div className="demo-option-label-item">
            <span role="img" aria-label={language.label}>
              {language.icon}
            </span>
            {language.label}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectLanguage;
