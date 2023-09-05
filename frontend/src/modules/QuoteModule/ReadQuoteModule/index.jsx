import { Button, Result } from 'antd';
import { ErpLayout } from '@/layout';
import ReadItem from '@/modules/ErpPanelModule/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

export default function ReadQuoteModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  } else
    return (
      <ErpLayout>
        {isSuccess ? (
          <ReadItem config={config} selectedItem={currentResult} />
        ) : (
          <Result
            status="404"
            title="Quote not found"
            subTitle="Sorry, the Quote you requested does not exist."
            extra={
              <Button
                type="primary"
                onClick={() => {
                  history.push(`/${config.entity.toLowerCase()}`);
                }}
              >
                Back to Quote Page
              </Button>
            }
          />
        )}
      </ErpLayout>
    );
}
