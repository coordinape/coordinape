// FIXME move Table and TableBorder to src/ui

import { ReactNode, useMemo, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { styled } from 'stitches.config';

import { Box } from 'ui';

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$3',
  tr: {
    borderBottom: '0.5px solid $lightBackground',
  },
  'thead tr': {
    backgroundColor: '$subtleGray',
    height: '$2xl',
  },
  'th, td': {
    textAlign: 'center',
    fontWeight: 'normal',
    color: '$text',
  },
  'th:first-child, td:first-child': {
    textAlign: 'left',
    paddingLeft: '$md',
  },
  'tbody tr': {
    backgroundColor: '$white',
    height: '$2xl',
  },
});

export const TableBorder = styled(Box, {
  boxShadow: '0px 12px 26px rgba(16, 30, 115, 0.06)',
  borderRadius: '$3',
  overflow: 'hidden',
});

export function makeTable<T>(displayName: string) {
  type TableProps<T> = {
    headers: string[];
    data: T[];
    children: (dataItem: T) => ReactNode;
    sortByIndex: (index: number) => (dataItem: T) => any;
    startingSortIndex?: number;
    startingSortDesc?: boolean;
  };

  const Component = function ({
    headers,
    data,
    children,
    sortByIndex,
    startingSortIndex = 0,
    startingSortDesc = false,
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
