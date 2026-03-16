// modules/PaymentModule/CreatePaymentModule/index.jsx
import { ErpLayout } from '@/layout';
import PaymentForm from '../PaymentForm';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';

export default function CreatePaymentModule({ config }) {
  const translate = useLanguage();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/${config.entity.toLowerCase()}`);
  };

  const handleSuccess = () => {
    // Redirect to payment list or show success message
    navigate(`/${config.entity.toLowerCase()}`);
    // You can also show a success notification here
  };

  return (
    <ErpLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2>{translate('Add New Payment')}</h2>
        <PaymentForm 
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </ErpLayout>
  );
}