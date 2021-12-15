import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

export default function FeedStoreMock({ data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(crud.currentItem({ data }));
  }, [data]);

  return null;
}
