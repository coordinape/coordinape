import { isFeatureEnabled } from '../../config/features';
import { order_by } from '../../lib/gql/__generated__/zeus';

export const getOrderBy = (val: typeof orderOptions[number]['value']) => {
  return orderOptions.find(o => o.value === val) ?? orderOptions[0];
};

export type Order = typeof orderOptions[number];

const coLinks = [
  {
    label: 'Most Link Holders',
    value: 'most_link_holders',
    orderBy: [
      {
        link_holders_aggregate: {
          sum: {
            amount: order_by.desc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Least Link Holders',
    value: 'least_link_holders',
    orderBy: [
      {
        link_holders_aggregate: {
          sum: {
            amount: order_by.asc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Most Links Held',
    value: 'most_links_held',
    orderBy: [
      {
        held_links_aggregate: {
          sum: {
            amount: order_by.desc_nulls_last,
          },
        },
      },
    ],
  },
  {
    label: 'Least Links Held',
    value: 'least_Links_held',
    orderBy: [
      {
        held_links_aggregate: {
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
  ...(isFeatureEnabled('soulkeys') ? coLinks : []),
];
