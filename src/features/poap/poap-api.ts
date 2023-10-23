import fetch from 'node-fetch';

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
