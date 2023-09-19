import { Button, Result } from 'antd';

import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import OfferForm from '@/modules/OfferModule/Forms/OfferForm';

import PageLoader from '@/components/PageLoader';

import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

export default function UpdateOfferModule({ config }) {
  const dispatch = useDispatch();

  const { id } = useParams();
  const history = useHistory();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  useLayoutEffect(() => {
    if (currentResult) {
      dispatch(erp.currentAction({ actionType: 'update', data: currentResult }));
    }
  }, [currentResult]);

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
          <UpdateItem config={config} UpdateForm={OfferForm} />
        ) : (
          <Result
            status="404"
            title="Offer not found"
            subTitle="Sorry, the Offer you requested does not exist."
            extra={
              <Button
                type="primary"
                onClick={() => {
                  history.push(`/${config.entity.toLowerCase()}`);
                }}
              >
                Back to Offer Page
              </Button>
            }
          />
        )}
      </ErpLayout>
    );
}
