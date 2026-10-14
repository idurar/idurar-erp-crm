import { UploadOutlined } from '@ant-design/icons';
import { message, Upload, Form, Button } from 'antd';
import useLanguage from '@/locale/useLanguage';

// import photo from '@/style/images/photo.png';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Sie können nur JPG- oder PNG-Dateien hochladen.');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Das Bild muss kleiner als 2 MB sein.');
  }
  return isJpgOrPng && isLt2M;
};
export default function UploadImg() {
  const translate = useLanguage();
  return (
    <Form.Item
      name="file"
      label={translate('Upload Image')}
      valuePropName="fileList"
      getValueFromEvent={(e) => e.fileList}
    >
      <Upload beforeUpload={beforeUpload}>
        <Button icon={<UploadOutlined />}>{translate('click_to_upload')}</Button>
      </Upload>
    </Form.Item>
  );
}
