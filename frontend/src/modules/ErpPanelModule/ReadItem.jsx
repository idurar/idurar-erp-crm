import { useState, useEffect } from 'react';
import { Divider } from 'antd';

import { Alert, Button, Row, Col, Descriptions, InputNumber, Modal, Statistic, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
  WarningOutlined,
  CopyOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';

import { selectCurrentItem } from '@/redux/erp/selectors';

import { useMoney } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';
import { request } from '@/request';
import dayjs from 'dayjs';
import { htmlToPlainText } from '@/utils/plainText';

const EMPTY_ERP = {
  status: '',
  client: { name: '', email: '', phone: '', address: '' },
  subTotal: 0,
  taxTotal: 0,
  taxRate: 0,
  total: 0,
  credit: 0,
  number: 0,
  year: 0,
};

const Item = ({ item, currentErp }) => {
  const { moneyFormatter } = useMoney();
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={7}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName}</strong>
        </p>
        <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {htmlToPlainText(item.description)}
        </Typography.Paragraph>
      </Col>
      <Col className="gutter-row" span={3}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={3}>
        <p
          style={{
            textAlign: 'right',
          }}
        >
          {moneyFormatter({ amount: item.price, currency_code: currentErp.currency })}
        </p>
      </Col>
      <Col className="gutter-row" span={3}>
        <p style={{ textAlign: 'right' }}>{item.unit || 'Stk.'}</p>
      </Col>
      <Col className="gutter-row" span={3}>
        <p style={{ textAlign: 'right' }}>{item.discount || 0} %</p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: 'right',
            fontWeight: '700',
          }}
        >
          {moneyFormatter({ amount: item.total, currency_code: currentErp.currency })}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moneyFormatter } = useMoney();
  const { send, isLoading: mailInProgress } = useMail({ entity });

  const { result: currentResult } = useSelector(selectCurrentItem);

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState(selectedItem ?? EMPTY_ERP);
  const [client, setClient] = useState({});
  const [reminderInProgress, setReminderInProgress] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationInProgress, setConfirmationInProgress] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(30);

  const recordReminder = async () => {
    setReminderInProgress(true);
    const data = await request.patch({
      entity: `invoice/remind/${currentErp._id}`,
      jsonData: { paymentPeriodDays: 7 },
    });
    setReminderInProgress(false);
    if (data.success) {
      dispatch(erp.read({ entity: 'invoice', id: currentErp._id }));
    }
  };

  const convertQuoteToInvoice = async () => {
    const data = await request.convert({ entity: 'quote', id: currentErp._id });
    if (data.success && data.result?._id) {
      dispatch(erp.currentItem({ data: data.result }));
      navigate(`/invoice/read/${data.result._id}`);
    }
  };

  const convertQuoteToOrderConfirmation = async () => {
    setConfirmationInProgress(true);
    const data = await request.post({
      entity: `orderconfirmation/from-quote/${currentErp._id}`,
      jsonData: { depositPercentage },
    });
    setConfirmationInProgress(false);
    if (data?.success) {
      setConfirmationModalOpen(false);
      navigate('/order-confirmations');
    }
  };

  const downloadPdf = (document = currentErp) =>
    request.download({
      path: `download/${entity}/${entity}-${document._id}.pdf`,
      filename: `${entity}-${document.number || document._id}.pdf`,
    });

  const publishInvoice = async () => {
    const response = await request.patch({
      entity: `invoice/issue/${currentErp._id}`,
      jsonData: {},
    });
    if (!response?.success) {
      throw new Error(response?.message || 'Rechnung konnte nicht veröffentlicht werden');
    }
    setCurrentErp(response.result);
    dispatch(erp.currentItem({ data: response.result }));
    return response.result;
  };

  const handleDownload = () => {
    if (entity !== 'invoice' || currentErp.issuedAt) return downloadPdf();
    return Modal.confirm({
      title: `Rechnung ${currentErp.number ? `${currentErp.number}/${currentErp.year || ''}` : 'Entwurf'} veröffentlichen und PDF herunterladen?`,
      content:
        'Danach ist die Rechnung nicht mehr bearbeitbar und enthaltene Lagerartikel werden ausgebucht.',
      okText: 'Veröffentlichen & PDF',
      cancelText: 'Abbrechen',
      onOk: async () => downloadPdf(await publishInvoice()),
    });
  };

  const handleSend = () => {
    if (entity !== 'invoice' || currentErp.issuedAt) return send(currentErp._id);
    return Modal.confirm({
      title: `Rechnung ${currentErp.number ? `${currentErp.number}/${currentErp.year || ''}` : 'Entwurf'} veröffentlichen und versenden?`,
      content:
        'Danach ist die Rechnung nicht mehr bearbeitbar und enthaltene Lagerartikel werden ausgebucht.',
      okText: 'Veröffentlichen & senden',
      cancelText: 'Abbrechen',
      onOk: async () => {
        const document = await publishInvoice();
        send(document._id);
      },
    });
  };

  useEffect(() => {
    if (currentResult) {
      const { items, invoice, ...others } = currentResult;

      if (items) {
        setItemsList(items);
        setCurrentErp(currentResult);
      } else if (invoice.items) {
        setItemsList(invoice.items);
        setCurrentErp({ ...invoice.items, ...others, ...invoice });
      }
    }
    return () => {
      setItemsList([]);
      setCurrentErp(EMPTY_ERP);
    };
  }, [currentResult]);

  useEffect(() => {
    if (currentErp?.client) {
      setClient(currentErp.client);
    }
  }, [currentErp]);

  return (
    <>
      <Modal
        title="Auftragsbestätigung aus Angebot erstellen"
        open={confirmationModalOpen}
        okText="Auftragsbestätigung erstellen"
        cancelText="Abbrechen"
        confirmLoading={confirmationInProgress}
        onOk={convertQuoteToOrderConfirmation}
        onCancel={() => setConfirmationModalOpen(false)}
      >
        <p>Wie hoch soll die erste Anzahlung sein? Die Restzahlung wird automatisch ergänzt.</p>
        <InputNumber
          min={1}
          max={99}
          precision={0}
          value={depositPercentage}
          onChange={(value) => setDepositPercentage(value || 30)}
          addonAfter="%"
          style={{ width: 180 }}
        />
      </Modal>
      {entity === 'invoice' && currentErp.complianceWarnings?.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message="Rechnung ist noch nicht vollständig prüffähig"
          description={currentErp.complianceWarnings.join(' ')}
          style={{ marginBottom: 16 }}
        />
      )}
      {entity === 'invoice' && currentErp.recurring && currentErp.recurring !== 'none' && (
        <Alert
          type={
            currentErp.recurringLastError
              ? 'error'
              : currentErp.recurringActive
                ? 'success'
                : 'warning'
          }
          showIcon
          message={
            currentErp.recurringLastError
              ? 'Wiederholung nach einem Fehler pausiert'
              : currentErp.recurringActive
              ? currentErp.issuedAt
                ? 'Wiederkehrende Rechnung aktiv'
                : 'Wiederholung wartet auf Veröffentlichung'
              : 'Wiederkehrende Rechnung pausiert'
          }
          description={
            currentErp.recurringLastError ||
            (currentErp.nextRecurringDate
              ? `Nächster Entwurf: ${dayjs(currentErp.nextRecurringDate).format('DD.MM.YYYY')}`
              : undefined)
          }
          style={{ marginBottom: 16 }}
        />
      )}
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        title={
          entity === 'invoice' && !currentErp.number
            ? `${ENTITY_NAME} – Entwurf`
            : `${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ''}`
        }
        ghost={false}
        tags={[
          <span key="status">{currentErp.status && translate(currentErp.status)}</span>,
          currentErp.paymentStatus && (
            <span key="paymentStatus">
              {currentErp.paymentStatus && translate(currentErp.paymentStatus)}
            </span>
          ),
        ]}
        extra={[
          <Button
            key="close"
            onClick={() => {
              navigate(`/${entity.toLowerCase()}`);
            }}
            icon={<CloseCircleOutlined />}
          >
            {translate('Close')}
          </Button>,
          <Button
            key="download"
            onClick={handleDownload}
            icon={<FilePdfOutlined />}
          >
            {entity === 'invoice' && !currentErp.issuedAt
              ? 'Veröffentlichen & PDF'
              : translate('Download PDF')}
          </Button>,
          <Button
            key="email"
            loading={mailInProgress}
            onClick={handleSend}
            icon={<MailOutlined />}
          >
            {entity === 'invoice' && !currentErp.issuedAt
              ? 'Veröffentlichen & senden'
              : translate('Send by Email')}
          </Button>,
          entity === 'invoice' && (
            <Button
              key="duplicate"
              onClick={() => navigate(`/invoice/create?from=${currentErp._id}`)}
              icon={<CopyOutlined />}
            >
              Als neue Rechnung verwenden
            </Button>
          ),
          entity === 'invoice' && currentErp.paymentStatus !== 'paid' && (
            <Button
              key="record-reminder"
              danger
              loading={reminderInProgress}
              onClick={recordReminder}
              icon={<WarningOutlined />}
            >
              {currentErp.reminderLevel
                ? `Mahnstufe ${Math.min(currentErp.reminderLevel + 1, 3)}`
                : 'Mahnung erfassen'}
            </Button>
          ),
          <Button
            key="convert"
            onClick={convertQuoteToInvoice}
            icon={<RetweetOutlined />}
            style={{ display: entity === 'quote' ? 'inline-block' : 'none' }}
          >
            {translate('Convert to Invoice')}
          </Button>,
          entity === 'quote' && (
            <Button
              key="order-confirmation"
              onClick={() => setConfirmationModalOpen(true)}
              icon={<FileDoneOutlined />}
            >
              Auftragsbestätigung erstellen
            </Button>
          ),

          <Button
            key="edit"
            onClick={() => {
              dispatch(
                erp.currentAction({
                  actionType: 'update',
                  data: currentErp,
                })
              );
              navigate(`/${entity.toLowerCase()}/update/${currentErp._id}`);
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            {translate('Edit')}
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      >
        <Row>
          <Statistic
            title={translate('Status')}
            value={currentErp.status ? translate(currentErp.status) : currentErp.status}
          />
          <Statistic
            title={translate('SubTotal')}
            value={moneyFormatter({
              amount: currentErp.subTotal,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Total')}
            value={moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            style={{
              margin: '0 32px',
            }}
          />
          <Statistic
            title={translate('Paid')}
            value={moneyFormatter({
              amount: currentErp.credit,
              currency_code: currentErp.currency,
            })}
            style={{
              margin: '0 32px',
            }}
          />
          {entity === 'invoice' && (
            <Statistic
              title="Mahnstatus"
              value={
                currentErp.paymentStatus === 'paid'
                  ? 'Bezahlt'
                  : currentErp.reminderLevel
                    ? `Mahnstufe ${currentErp.reminderLevel}`
                    : 'Keine Mahnung'
              }
              style={{ margin: '0 32px' }}
            />
          )}
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Kunde: ${currentErp.client.name}`}>
        <Descriptions.Item label={translate('Address')}>{client.address}</Descriptions.Item>
        <Descriptions.Item label={translate('email')}>{client.email}</Descriptions.Item>
        <Descriptions.Item label={translate('Phone')}>{client.phone}</Descriptions.Item>
        <Descriptions.Item label="UID-Nummer">
          {currentErp.clientVatNumber || client.vatNumber || '—'}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={7}>
          <p>
            <strong>Beschreibung</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Quantity')}</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Price')}</strong>
          </p>
        </Col>
        <Col span={3}>
          <p style={{ textAlign: 'right' }}>
            <strong>Einheit</strong>
          </p>
        </Col>
        <Col span={3}>
          <p style={{ textAlign: 'right' }}>
            <strong>Rabatt</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p
            style={{
              textAlign: 'right',
            }}
          >
            <strong>{translate('Total')}</strong>
          </p>
        </Col>
        <Divider />
      </Row>
      {itemslist.map((item) => (
        <Item key={item._id} item={item} currentErp={currentErp}></Item>
      ))}
      {(currentErp.paymentTermsText || currentErp.footerText) && (
        <Row gutter={24} style={{ clear: 'both', paddingTop: 24 }}>
          <Col span={12}>
            <strong>Zahlungskonditionen</strong>
            <p>{currentErp.paymentTermsText}</p>
          </Col>
          <Col span={12}>
            <strong>Fußzeilentext</strong>
            <p>{currentErp.footerText}</p>
          </Col>
        </Row>
      )}
      <div
        style={{
          width: '300px',
          float: 'right',
          textAlign: 'right',
          fontWeight: '700',
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>{translate('Sub Total')} :</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.subTotal, currency_code: currentErp.currency })}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {translate('Tax Total')} ({currentErp.taxRate} %) :
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.taxTotal, currency_code: currentErp.currency })}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>{translate('Total')} :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {moneyFormatter({ amount: currentErp.total, currency_code: currentErp.currency })}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
