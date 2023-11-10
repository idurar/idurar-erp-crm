import { erp } from '@/redux/erp/actions';
import { useDispatch } from 'react-redux';

export default function useMail({ entity }) {
  const dispatch = useDispatch();

  const send = (id) => {
    const jsonData = { id };
    dispatch(erp.mail({ entity, jsonData }));
  };

  return { send };
}
