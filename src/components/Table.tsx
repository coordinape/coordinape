import { ReactNode, useEffect, useMemo, useState } from 'react';

import sortBy from 'lodash-es/sortBy';
import type { CSS } from 'stitches.config';

import { Box, Table } from 'ui';

import { Paginator } from './Paginator';

export function makeTable<T>(displayName: string) {
  type TableProps<T> = {
    data?: T[];
    children: (dataItem: T) => ReactNode;
    startingSortIndex?: number;
    startingSortDesc?: boolean;
    sortByColumn: (index: number) => (dataItem: T) => any;
    perPage?: number;
    css?: CSS;
    filtering?: boolean;
    headers: {
      title: string | React.ReactNode;
      css?: CSS;
      isHidden?: boolean;
      noSort?: boolean;
    }[];
  };
  const Component = function ({
    headers,
    data,
    children,
    sortByColumn,
    startingSortIndex = 0,
    startingSortDesc = false,
    perPage = 10,
    filtering = false,
    css,
  }: TableProps<T>) {
    const [sortIndex, setSortIndex] = useState(startingSortIndex);
    const [sortDesc, setSortDesc] = useState(startingSortDesc);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
      if (filtering) setPage(0);
    }, [filtering]);
    const resort = (index: number) => {
      if (index === sortIndex) {
        setSortDesc(!sortDesc);
      } else {
        setSortIndex(index);
      }
    };
    const sortedData = useMemo(() => {
      const newSortedData = sortBy(data, sortByColumn(sortIndex));
      if (sortDesc) newSortedData.reverse();
      return newSortedData;
    }, [sortIndex, sortDesc, sortByColumn]);

    const pagedView = useMemo(
      () =>
        sortedData.slice(
          page * perPage,
          Math.min((page + 1) * perPage, sortedData.length),
        ),
      [sortedData, perPage, page],
    );

    const totalPages = Math.ceil(sortedData.length / perPage);

    return (
      <>
        <Table css={{ ...css }}>
          <thead>
            <tr>
              {headers.map(
                (header, index: number) =>
                  !header.isHidden && (
                    <th key={index}>
                      <Box
                        onClick={
                          header.noSort ? undefined : () => resort(index)
                        }
                        css={{ cursor: 'pointer', ...header.css }}
                      >
                        {header.title}
                        {sortIndex === index ? (sortDesc ? ' ↓' : ' ↑') : ''}
                      </Box>
                    </th>
                  ),
              )}
            </tr>
          </thead>
          <tbody>{pagedView.map(children)}</tbody>
        </Table>
        <Paginator
          pages={totalPages}
          current={page}
          onSelect={setPage}
          css={{ mt: '$md', mr: '$md' }}
        />
      </>
    );
  };

  Component.displayName = displayName;
  return Component;
}
