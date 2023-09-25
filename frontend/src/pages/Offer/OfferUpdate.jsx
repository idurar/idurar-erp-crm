import configPage from './config';
import UpdateOfferModule from '@/modules/OfferModule/UpdateOfferModule';

export default function OfferUpdate() {

  const config = {
    ...configPage,
    //customConfig,
  };
  return <UpdateOfferModule config={config} />;
}
