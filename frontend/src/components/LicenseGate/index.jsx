import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Input, Spin, Typography } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import AuthModule from '@/modules/AuthModule';
import { API_BASE_URL } from '@/config/serverApiConfig';

const { Paragraph, Text } = Typography;

export default function LicenseGate({ children }) {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [activating, setActivating] = useState(false);

  const checkStatus = useCallback(async () => {
    setStatus('loading');
    setMessage('');
    try {
      const response = await axios.get(`${API_BASE_URL}license/status`);
      setStatus(response.data?.result?.licensed ? 'licensed' : 'required');
    } catch {
      setStatus('unavailable');
      setMessage('Der Lizenzdienst ist momentan nicht erreichbar.');
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const activate = async ({ licenseKey }) => {
    setActivating(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}license/activate`, { licenseKey });
      if (response.data?.success) setStatus('licensed');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Die Lizenz konnte nicht aktiviert werden. Bitte erneut versuchen.'
      );
    } finally {
      setActivating(false);
    }
  };

  if (status === 'licensed') return children;
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" tip="Lizenz wird geprüft" />
      </div>
    );
  }

  return (
    <AuthModule
      AUTH_TITLE="WIEPILOT aktivieren"
      authContent={
        <>
          <Paragraph>
            Bitte geben Sie den Lizenzschlüssel für diese Installation ein. Jeder Schlüssel kann
            nur einmal vergeben werden.
          </Paragraph>
          {message && <Alert type="error" showIcon message={message} style={{ marginBottom: 20 }} />}
          {status === 'unavailable' ? (
            <Button type="primary" size="large" block onClick={checkStatus}>
              Erneut verbinden
            </Button>
          ) : (
            <Form layout="vertical" onFinish={activate}>
              <Form.Item
                name="licenseKey"
                label="Lizenzschlüssel"
                normalize={(value) => value?.trim().toUpperCase()}
                rules={[
                  { required: true, message: 'Bitte einen Lizenzschlüssel eingeben.' },
                  {
                    pattern: /^WIEPILOT(?:-[A-Z0-9]{8}){6}$/,
                    message: 'Der Lizenzschlüssel hat nicht das erwartete Format.',
                  },
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  autoComplete="off"
                  placeholder="WIEPILOT-XXXXXXXX-..."
                  size="large"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={activating} size="large" block>
                Lizenz aktivieren
              </Button>
            </Form>
          )}
          <Paragraph style={{ marginTop: 20 }}>
            <Text type="secondary">
              Wurde Ihr Schlüssel bereits vergeben, wenden Sie sich bitte an den WIEPILOT-Support.
            </Text>
          </Paragraph>
        </>
      }
    />
  );
}
