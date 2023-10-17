import { isFeatureEnabled } from '../../config/features';
import { order_by } from '../../lib/gql/__generated__/zeus';

export const getOrderBy = (val: typeof orderOptions[number]['value']) => {
  return orderOptions.find(o => o.value === val) ?? orderOptions[0];
};

export type Order = typeof orderOptions[number];

const soulKeys = [
  {
    label: 'Most Key Holders',
    value: 'most_key_holders',
    orderBy: [
      {
        key_holders_aggregate: {
          sum: {
            amount: order_by.desc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Least Key Holders',
    value: 'least_key_holders',
    orderBy: [
      {
        key_holders_aggregate: {
          sum: {
            amount: order_by.asc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Most Keys Held',
    value: 'most_keys_held',
    orderBy: [
      {
        held_keys_aggregate: {
          sum: {
            amount: order_by.desc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Least Keys Held',
    value: 'least_keys_held',
    orderBy: [
      {
        held_keys_aggregate: {
          sum: {
            amount: order_by.asc_nulls_last,
          },
        },
      },
    ],
  },
];

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
  ...(isFeatureEnabled('soulkeys') ? soulKeys : []),
];
