import configPage from './config';
import CreateOfferModule from '@/modules/OfferModule/CreateOfferModule';

const config = {
  ...configPage,
  //customConfig,
};

export default function OfferCreate() {
  return <CreateOfferModule config={config} />;
}
