import { Result, Button } from 'antd';
import useLanguage from '@/lang/useLanguage';
import { useHistory } from 'react-router-dom';

export default function NotFound({ entity }) {
  const translate = useLanguage();

  const history = useHistory();

  return (
    <Result
      status="404"
      title={translate('error_404')}
      subTitle={translate('Sorry the Page you requested does not exist')}
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push(`/${entity?.toLowerCase()}`);
          }}
        >
          {translate('Back')}
        </Button>
      }
    />
  );
}
