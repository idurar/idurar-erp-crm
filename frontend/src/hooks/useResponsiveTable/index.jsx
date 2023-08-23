import { useLayoutEffect, useMemo } from 'react';
import { useRef, useState } from 'react';

//q: this file is a hook

export default function useResponsiveTable(dataTableColumns, items) {
  // this hook returns two arays of columns
  // one for mobile and one for desktop

  const [tableColumns, setTableColumns] = useState(dataTableColumns);
  const [expandedRowData, setExpandedRowData] = useState([]);
  const [headerWidth, setHeaderWidth] = useState(0);
  const tableHeader = useRef(null);

  useLayoutEffect(() => {
    const header = tableHeader.current;
    if (!header) return;
    checkTableWidth(header.clientWidth);
    const observer = new ResizeObserver(() => {
      // 👉 Do something when the element is resized
      checkTableWidth(header.clientWidth);
    });

    observer.observe(header);
    return () => {
      observer.disconnect();
    };
  }, [headerWidth, expandedRowData.length, items.length]);

  const checkTableWidth = (width) => {
    // this function checks the width of the table
    const tableWidth = document.querySelector('.ant-table-thead').offsetWidth;
    if (width < tableWidth) {
      setHeaderWidth(width);
      shrinkTable();
      return;
    }
    if (width - headerWidth > 100) {
      expandTable();
      setHeaderWidth((prev) => prev + 100);
      return;
    }
  };

  const shrinkTable = () => {
    // this function shrinks the table
    if (tableColumns.length === 3) return;
    const arr = [...tableColumns];
    const element = arr.splice(tableColumns.length - 2, 1);
    setTableColumns([...arr]);
    setExpandedRowData([...element, ...expandedRowData]);
  };

  const expandTable = () => {
    // this function expands the table
    if (tableColumns.length === dataTableColumns.length) return;
    const arr = [...expandedRowData];
    const newArr = [...tableColumns];
    const element = arr.splice(0, 1);
    newArr.splice(tableColumns.length - 1, 0, ...element);
    setTableColumns([...newArr]);
    setExpandedRowData([...arr]);
  };

  const memoizedResult = useMemo(
    () => ({
      tableColumns,
      expandedRowData,
      tableHeader,
    }),
    [tableColumns, expandedRowData, tableHeader]
  );

  return memoizedResult;
}
