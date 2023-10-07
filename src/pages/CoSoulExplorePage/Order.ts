import { order_by } from '../../lib/gql/__generated__/zeus';

export const getOrderBy = (val: typeof orderOptions[number]['value']) => {
  return orderOptions.find(o => o.value === val) ?? orderOptions[0];
};

export type Order = typeof orderOptions[number];

export const orderOptions = [
  {
    label: 'Most PGIVE',
    value: 'mostPgive',
    orderBy: [
      {
        pgive: order_by.desc_nulls_last,
      },
    ],
  },
  {
    label: 'Least PGIVE',
    value: 'leastPgive',
    orderBy: [
      {
        pgive: order_by.asc_nulls_last,
      },
    ],
  },
  {
    label: 'Newest',
    value: 'newest',
    orderBy: [
      {
        id: order_by.desc_nulls_last,
      },
    ],
  },
  {
    label: 'Oldest',
    value: 'oldest',
    orderBy: [
      {
        id: order_by.asc_nulls_last,
      },
    ],
  },
];
