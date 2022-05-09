import { ReactNode, useMemo, useState } from 'react';

import sortBy from 'lodash/sortBy';

import { Box, Table, TableBorder } from 'ui';

export function makeTable<T>(displayName: string) {
  type TableProps<T> = {
    headers: string[];
    data: T[];
    children: (dataItem: T) => ReactNode;
    sortByIndex: (index: number) => (dataItem: T) => any;
    startingSortIndex?: number;
    startingSortDesc?: boolean;
    Table: typeof Table;
    TableBorder: typeof TableBorder;
  };

  const Component = function ({
    headers,
    data,
    children,
    sortByIndex,
    startingSortIndex = 0,
    startingSortDesc = false,
    Table,
    TableBorder,
  }: TableProps<T>) {
    const [sortIndex, setSortIndex] = useState(startingSortIndex);
    const [sortDesc, setSortDesc] = useState(startingSortDesc);

    const resort = (index: number) => {
      if (index === sortIndex) {
        setSortDesc(!sortDesc);
      } else {
        setSortIndex(index);
      }
    };

    const sortedData = useMemo(() => {
      const newSortedData = sortBy(data, sortByIndex(sortIndex));
      if (sortDesc) newSortedData.reverse();
      return newSortedData;
    }, [sortIndex, sortDesc, sortByIndex]);

    return (
      <TableBorder>
        <Table>
          <thead>
            <tr>
              {headers.map((header: string, index: number) => (
                <th key={index}>
                  <Box
                    onClick={() => resort(index)}
                    css={{ cursor: 'pointer' }}
                  >
                    {header}
                    {sortIndex === index ? (sortDesc ? ' ↓' : ' ↑') : ''}
                  </Box>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{sortedData.map(children)}</tbody>
        </Table>
      </TableBorder>
    );
  };

  Component.displayName = displayName;
  return Component;
}
