// FIXME move Table and TableBorder to src/ui

import { ReactNode, useMemo, useState } from 'react';

import sortBy from 'lodash/sortBy';
import { styled } from 'stitches.config';

import { Box } from 'ui';

export const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$small',
  tr: {
    borderBottom: '0.5px solid $border',
  },
  'thead tr': {
    backgroundColor: '$background',
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
    sortByColumn: (index: number) => (dataItem: T) => any;
    startingSortIndex?: number;
    startingSortDesc?: boolean;
  };

  const Component = function ({
    headers,
    data,
    children,
    sortByColumn,
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
      const newSortedData = sortBy(data, sortByColumn(sortIndex));
      if (sortDesc) newSortedData.reverse();
      return newSortedData;
    }, [sortIndex, sortDesc, sortByColumn]);

    return (
      <TableBorder>
        <Table>
          <thead>
            <tr>
              {headers.map((header: string, index: number) => (
                <th key={index} className={`col${index}`}>
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
