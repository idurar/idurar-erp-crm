import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

export default function FeedStoreMock({ method, data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(method({ data }));
  }, [data]);

  return null;
}
