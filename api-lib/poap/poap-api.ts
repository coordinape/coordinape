import assert from 'assert';

import fetch from 'node-fetch';

import {
  ValueTypes,
  poap_events_constraint,
  poap_holders_constraint,
  order_by,
  address_data_fetches_constraint,
  address_data_fetches_update_column,
  poap_events_update_column,
} from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';

const baseUrl = 'https://api.poap.tech';

export const fetchOptions = { timeout: 10000 };

const apiKey = process.env.POAP_API_KEY;
assert(apiKey, 'POAP_API_KEY not set');

type EventData = {
  id: number;
  fancy_id: string;
  name: string;
  event_url: string;
  image_url: string;
  country: string;
  city: string;
  description: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  supply: number;
};

type Data = {
  event: EventData;
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
};

const options = {
  method: 'GET',
  headers: [
    ['accept', 'application/json'],
    ['x-api-key', apiKey],
  ],
  timeout: 1000,
};

const getEventsForAddress = async (address: string): Promise<Data[]> => {
  try {
    const url = baseUrl + '/actions/scan/' + address;
    const res = await fetch(url, options);
    const data: Data[] = await res.json();
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error fetching poap data', e);
    throw e;
  }
};

export const fetchPoapDataForTopCosouls = async () => {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          order_by: [{ pgive: order_by.desc }],
          where: {
            address_data_fetches: {
              poap_synced_at: { _is_null: true },
            },
          },
          limit: 10,
        },
        {
          address: true,
        },
      ],
    },
    {
      operationName: 'fetchPoapDataForTopCosouls',
    }
  );

  for (const soul of cosouls) {
    await syncPoapDataForAddress(soul.address);
  }
};

export const syncPoapDataForAddress = async (address: string) => {
  const data = await getEventsForAddress(address);

  const events: ValueTypes['poap_events_insert_input'][] = [];
  const holders: ValueTypes['poap_holders_insert_input'][] = [];

  // collect events key from data and rename id key to poap_id
  data.map(d => {
    const { id, ...eventData } = d.event;
    events.push({
      ...eventData,
      poap_id: id,
    });

    holders.push({
      event_id: id,
      address: d.owner,
      token_id: Number(d.tokenId),
      chain: d.chain,
      poap_created: d.created,
    });
  });

  const { insert_poap_events } = await adminClient.mutate(
    {
      insert_poap_events: [
        {
          objects: events,
          on_conflict: {
            constraint: poap_events_constraint.poap_events_poap_id_key,
            update_columns: [
              poap_events_update_column.city,
              poap_events_update_column.country,
              poap_events_update_column.description,
              poap_events_update_column.end_date,
              poap_events_update_column.event_url,
              poap_events_update_column.expiry_date,
              poap_events_update_column.fancy_id,
              poap_events_update_column.image_url,
              poap_events_update_column.name,
              poap_events_update_column.start_date,
              poap_events_update_column.supply,
              poap_events_update_column.year,
            ],
          },
        },
        {
          __typename: true,
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'insert_poap_events',
    }
  );

  const { insert_poap_holders } = await adminClient.mutate(
    {
      insert_poap_holders: [
        {
          objects: holders,
          on_conflict: {
            constraint: poap_holders_constraint.poap_holders_token_id_key,
            update_columns: [],
          },
        },
        {
          __typename: true,
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'insert_poap_holders',
    }
  );

  const { insert_address_data_fetches_one } = await adminClient.mutate(
    {
      insert_address_data_fetches_one: [
        {
          address: address,
          object: {
            poap_synced_at: 'now()',
          },
          on_conflict: {
            constraint:
              address_data_fetches_constraint.address_data_fetches_pkey,
            update_columns: [address_data_fetches_update_column.poap_synced_at],
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insert_address_data_fetches_poap',
    }
  );

  return {
    insert_poap_holders,
    insert_poap_events,
    insert_address_data_fetches_one,
  };
};
