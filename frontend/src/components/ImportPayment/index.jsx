import { useState } from 'react';
import { Button, Modal, Upload, Table, Space, Alert, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

export default function ImportPayment({ onDone }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async (f, isPreview) => {
    const fd = new FormData();
    fd.append('file', f);
    const { data } = await axios.post(
      `${API_BASE_URL}payment/import${isPreview ? '?preview=true' : ''}`,
      fd,
      { withCredentials: true }
    );
    return data.result;
  };

  const reset = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
  };

  const onPick = async (f) => {
    setFile(f);
    setPreview(null);
    setLoading(true);
    try {
      setPreview(await send(f, true));
    } catch (e) {
      message.error(e.response?.data?.message || 'Preview failed');
      setFile(null);
    } finally {
      setLoading(false);
    }
    return false; 
  };

  const onImport = async () => {
    setLoading(true);
    try {
      const r = await send(file, false);
      message.success(`${r.inserted} payments imported`);
      reset();
      onDone && onDone();
    } catch (e) {
      message.error(e.response?.data?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button icon={<UploadOutlined />} onClick={() => setOpen(true)}>
        Import
      </Button>
      <Modal
        title="Import Payments (CSV / XLSX)"
        open={open}
        onCancel={reset}
        footer={[
          <Button key="c" onClick={reset}>Cancel</Button>,
          <Button
            key="i"
            type="primary"
            loading={loading}
            disabled={!preview || preview.valid === 0}
            onClick={onImport}
          >
            Import {preview ? preview.valid : 0} payments
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            accept=".csv,.xlsx"
            maxCount={1}
            beforeUpload={onPick}
            onRemove={() => { setFile(null); setPreview(null); }}
          >
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
          <div>
            Columns: number (digits), invoice (invoice number), amount, date, currency, ref,
            description (optional: year). Invoice must already exist.
          </div>
          {preview && (
            <>
              <Alert
                type={preview.errors.length ? 'warning' : 'success'}
                message={`${preview.valid} valid of ${preview.total} rows, ${preview.errors.length} skipped`}
              />
              {preview.errors.length > 0 && (
                <Table
                  size="small"
                  rowKey={(r) => `${r.row}-${r.invoice}-${r.error}`}
                  pagination={{ pageSize: 5 }}
                  dataSource={preview.errors}
                  columns={[
                    { title: 'Row', dataIndex: 'row', width: 70 },
                    { title: 'Invoice', dataIndex: 'invoice', width: 90 },
                    { title: 'Error', dataIndex: 'error' },
                  ]}
                />
              )}
            </>
          )}
        </Space>
      </Modal>
    </>
  );
}