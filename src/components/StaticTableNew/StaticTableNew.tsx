import React, { useState, useEffect, useMemo } from 'react';

import clsx from 'clsx';
import isEqual from 'lodash/isEqual';

import { makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

import { Spacer } from 'components';
import { usePrevious } from 'hooks';

import { ITableColumn } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.white,
    boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
    borderRadius: theme.spacing(1),
  },
  label: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.colors.text,
  },
  table: {
    borderCollapse: 'collapse',
    position: 'relative',
  },
  headerTr: {
    height: 48,
    borderBottom: '0.5px solid #E3E3E3',
    background: theme.colors.subtleGray,
  },
  emptyHeader: {
    opacity: 0.5,
  },
  headerTh: {
    width: '11.6%',
    fontSize: 14,
    fontWeight: 300,
    color: theme.colors.text,
    '&:first-child': {
      paddingLeft: theme.spacing(2),
    },
  },
  tableTr: {
    borderBottom: '0.5px solid #E3E3E3',
    minHeight: 48,
  },
  tableTd: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.colors.text,
    textAlign: 'center',
    '&:first-child': {
      paddingLeft: theme.spacing(2),
    },
  },
  sortable: {
    cursor: 'pointer',
  },
  wide: {
    width: '20%',
  },
  narrow: {
    width: '5%',
  },
  leftAlign: {
    textAlign: 'left',
  },
  pagination: {
    margin: theme.spacing(2, 0),
  },
  placeholder: {
    height: 280,
    backgroundColor: theme.colors.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface GenericObject {
  [index: string]: any;
}

const defaultSort = (a: any, b: any) => (a > b ? 1 : a < b ? -1 : 0);

export const StaticTableNew = ({
  className,
  columns,
  data,
  perPage,
  filter,
  sortable,
  placeholder,
}: {
  className?: string;
  columns: ITableColumn[];
  data: any[];
  perPage: number;
  filter?: (o: any) => boolean;
  sortable?: boolean;
  placeholder?: React.ReactNode;
  label?: string;
}) => {
  const classes = useStyles();

  const [view, setView] = useState<any[]>([]);
  const previousView = usePrevious(view);
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<{ field: number; ascending: number }>({
    field: 0,
    ascending: 1,
  });

  const getValueByCid = (item: GenericObject, cid: number) => {
    const { render, accessor } = columns[cid];
    return render ? render?.(item) : accessor ? item[accessor] : '-';
  };

  const getSortValueByCid = (item: GenericObject, cid: number) => {
    const { render, accessor } = columns[cid];
    return accessor ? item[accessor] : render ? render?.(item) : '-';
  };

  useEffect(() => {
    const sortItem = columns[order.field]?.sortFunc ?? defaultSort;
    const sorter = (a: GenericObject, b: GenericObject) =>
      order.ascending *
      sortItem(
        getSortValueByCid(a, order.field),
        getSortValueByCid(b, order.field)
      );

    const filtered = filter ? data.filter(filter) : data;
    setView(sortable ? [...filtered].sort(sorter) : filtered);
  }, [data, perPage, filter, columns, order]);

  useEffect(() => {
    if (!isEqual(view, previousView)) {
      setPage(1);
    }
  }, [view]);

  const pagedView = useMemo(
    () =>
      view.slice((page - 1) * perPage, Math.min(page * perPage, view.length)),
    [view, perPage, page]
  );

  const onClickSort = (field: number) => {
    if (order.field !== field) {
      setOrder({ field, ascending: 1 });
    } else {
      setOrder({ field, ascending: -order.ascending });
    }
  };

  const onClickPage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className={clsx(className, classes.root)}>
      <table className={classes.table}>
        <thead>
          <tr
            className={clsx(classes.headerTr, {
              [classes.emptyHeader]: !data.length,
            })}
          >
            {columns.map(({ label, wide, narrow, noSort, leftAlign }, idx) => (
              <th
                key={idx}
                className={clsx(classes.headerTh, {
                  [classes.sortable]: sortable && !noSort,
                  [classes.wide]: wide,
                  [classes.narrow]: narrow,
                  [classes.leftAlign]: leftAlign,
                })}
                onClick={
                  sortable && !noSort ? () => onClickSort(idx) : undefined
                }
              >
                {label}
                {order.field === idx && sortable
                  ? order.ascending > 0
                    ? ' ↓'
                    : ' ↑'
                  : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length
            ? pagedView.map((row, rid) => (
                <tr className={classes.tableTr} key={rid}>
                  {columns.map(({ leftAlign }, cid) => (
                    <td
                      key={cid}
                      className={clsx(classes.tableTd, {
                        [classes.leftAlign]: leftAlign,
                      })}
                    >
                      {getValueByCid(row, cid)}
                    </td>
                  ))}
                </tr>
              ))
            : placeholder && (
                <tr>
                  <td colSpan={columns.length}>
                    <div className={classes.placeholder}>{placeholder}</div>
                  </td>
                </tr>
              )}
        </tbody>
      </table>
      {data.length > perPage ? (
        <Pagination
          className={classes.pagination}
          color="secondary"
          count={Math.ceil(view.length / perPage)}
          onChange={onClickPage}
          page={page}
          shape="rounded"
          variant="outlined"
        />
      ) : (
        <Spacer h={32} />
      )}
    </div>
  );
};
