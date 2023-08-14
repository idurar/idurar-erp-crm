import { Row, Col } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import AnalyticSummaryCard from '@/components/Dashboard/AnalyticSummaryCard';
import AnalyticStatisticCard from '@/components/Dashboard/AnalyticStatisticCard';
import AnalyticCustomerCard from './AnalyticCustomerCard';

export default function Analytics() {
  const {
    result: invoiceResult,
    isSuccess: invoiceSuccess,
    isLoading: invoiceLoading,
  } = useFetch(() => request.summary({ entity: 'invoice' }));

  const {
    result: quoteResult,
    isSuccess: quoteSuccess,
    isLoading: quoteLoading,
  } = useFetch(() => request.summary({ entity: 'quote' }));

  const {
    result: paymentResult,
    isSuccess: paymentSuccess,
    isLoading: paymentLoading,
  } = useFetch(() => request.summary({ entity: 'paymentInvoice' }));

  const {
    result: clientResult,
    isSuccess: clientSuccess,
    isLoading: clientLoading,
  } = useFetch(() => request.summary({ entity: 'client' }));

  return (
    <>
      <Row gutter={[24, 24]}>
        <AnalyticSummaryCard
          title={'Invoice'}
          tagColor={'cyan'}
          prefix={'This month'}
          isLoading={invoiceLoading}
          tagContent={
            invoiceResult?.total &&
            `$ ${invoiceResult?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        />
        <AnalyticSummaryCard
          title={'Quote'}
          tagColor={'purple'}
          prefix={'This month'}
          isLoading={quoteLoading}
          tagContent={
            quoteResult?.total && `$ ${quoteResult?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        />
        <AnalyticSummaryCard
          title={'Payment'}
          tagColor={'green'}
          prefix={'This month'}
          isLoading={paymentLoading}
          tagContent={
            paymentResult?.total &&
            `$ ${paymentResult?.total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        />
        <AnalyticSummaryCard
          title={'Due Balance'}
          tagColor={'red'}
          prefix={'Not Paid'}
          isLoading={invoiceLoading}
          tagContent={
            invoiceResult?.total_undue &&
            `$ ${invoiceResult?.total_undue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col
          className="gutter-row"
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 18 }}
        >
          <div className="whiteBox shadow" style={{ minHeight: '380px' }}>
            <Row className="pad10" gutter={[0, 0]}>
              <AnalyticStatisticCard
                title="Invoice Preview"
                isLoading={invoiceLoading}
                statistics={
                  (invoiceSuccess &&
                    invoiceResult?.performance?.map((item) => ({
                      tag: item?.status,
                      color: 'blue',
                      value: item?.percentage,
                    }))) ||
                  []
                }
              />
              <AnalyticStatisticCard
                title="Quote Preview"
                isLoading={quoteLoading}
                statistics={
                  (quoteSuccess &&
                    quoteResult?.performance?.map((item) => ({
                      tag: item?.status,
                      color: 'blue',
                      value: item?.percentage,
                    }))) ||
                  []
                }
              />
              <AnalyticStatisticCard title="Offer Preview" />
            </Row>
          </div>
        </Col>
        
        <AnalyticCustomerCard 
          isLoading={clientLoading}
          activeCustomer={clientResult?.active}
          newCustomer={clientResult?.new}
        />
      </Row>
    </>
  );
}
