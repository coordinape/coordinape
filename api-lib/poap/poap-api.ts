/* eslint-disable no-console */
import fetch from 'node-fetch';

import { poap_events_constraint } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';

const baseUrl = 'https://api.poap.tech';

export const fetchOptions = { timeout: 10000 };

const apiKey = process.env.POAP_API_KEY || '';

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

export const getEventsForAddress = async (address: string): Promise<Data[]> => {
  const url = baseUrl + '/actions/scan/' + address;
  const res = await fetch(url, options);
  const data: Data[] = await res.json();
  console.log({ data });
  return data;
};

export const syncPoapDataForAddress = async (address: string) => {
  const data = await getEventsForAddress(address);

  // collect events key from data and rename id key to poap_id
  const events = data.map(d => {
    const { id, ...rest } = d.event;
    return {
      ...rest,
      poap_id: id,
    };
  });

  console.log({ events });

  const res = await adminClient.mutate(
    {
      insert_poap_events: [
        {
          objects: events,
          on_conflict: {
            constraint: poap_events_constraint.poap_events_poap_id_key,
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
      operationName: 'insert_poap_events',
    }
  );
  return res;
};
