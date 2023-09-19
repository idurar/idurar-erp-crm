import configPage from './config';
import ReadOfferModule from '@/modules/OfferModule/ReadOfferModule';

export default function OfferRead() {
  const config = {
    ...configPage,
    //customConfig,
  };
  return <ReadOfferModule config={config} />;
}
