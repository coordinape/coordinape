import { ReactNode, useMemo, useState } from 'react';

import sortBy from 'lodash/sortBy';

import { Box, Panel, Table } from 'ui';

export function makeTable<T>(displayName: string) {
  type TableProps<T> = {
    data: T[];
    children: (dataItem: T) => ReactNode;
    startingSortIndex?: number;
    startingSortDesc?: boolean;
    sortByColumn: (index: number) => (dataItem: T) => any;
    headers: {
      title: string;
      style?: any;
    }[];
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
      <Panel
        css={{ backgroundColor: '$white', padding: '$md', overflowX: 'auto' }}
      >
        <Table>
          <thead>
            <tr>
              {headers.map((header, index: number) => (
                <th key={index}>
                  <Box
                    onClick={() => resort(index)}
                    css={{ cursor: 'pointer', ...header.style }}
                  >
                    {header.title}
                    {sortIndex === index ? (sortDesc ? ' ↓' : ' ↑') : ''}
                  </Box>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{sortedData.map(children)}</tbody>
        </Table>
      </Panel>
    );
  };

  Component.displayName = displayName;
  return Component;
}
