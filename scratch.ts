import { writeFileSync } from 'fs';

import { createNextEpoch } from './api/hasura/cron/epochs';
const payload = {
  data: {
    circles: [
      {
        id: 2736,
        name: '🧠 Meta Guild',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 14252,
            start_date: '2023-02-05T12:00:00+00:00',
            end_date: '2023-02-11T12:00:00+00:00',
            circle_id: 2736,
            repeat_data: {
              duration: 6,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'weeks',
            },
          },
        ],
      },
      {
        id: 1400,
        name: 'This Little Piggy',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 13318,
            start_date: '2023-02-05T00:00:00+00:00',
            end_date: '2023-02-11T00:00:00+00:00',
            circle_id: 1400,
            repeat_data: {
              duration: 6,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'months',
            },
          },
        ],
      },
      {
        id: 2058,
        name: 'Advocate Committee',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 13199,
            start_date: '2023-02-01T00:00:00+00:00',
            end_date: '2023-02-09T00:00:00+00:00',
            circle_id: 2058,
            repeat_data: {
              duration: 8,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'months',
            },
          },
        ],
      },
      {
        id: 2482,
        name: 'The DAO Book Contributor Circle',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 14240,
            start_date: '2023-02-04T04:40:00+00:00',
            end_date: '2023-02-11T04:40:00+00:00',
            circle_id: 2482,
            repeat_data: {
              duration: 7,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'weeks',
            },
          },
        ],
      },
      {
        id: 2057,
        name: 'Ops Committee',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 13197,
            start_date: '2023-02-01T00:00:00+00:00',
            end_date: '2023-02-09T00:00:00+00:00',
            circle_id: 2057,
            repeat_data: {
              duration: 8,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'months',
            },
          },
        ],
      },
      {
        id: 2059,
        name: 'Grant Committee',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 13198,
            start_date: '2023-02-01T00:00:00+00:00',
            end_date: '2023-02-09T00:00:00+00:00',
            circle_id: 2059,
            repeat_data: {
              duration: 8,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'months',
            },
          },
        ],
      },
      {
        id: 192,
        name: 'Cultur3 Capital',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 14254,
            start_date: '2023-02-04T13:40:00+00:00',
            end_date: '2023-02-11T13:40:00+00:00',
            circle_id: 192,
            repeat_data: {
              duration: 7,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'weeks',
            },
          },
        ],
      },
      {
        id: 707,
        name: 'FIAT DAO Moderators',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 14330,
            start_date: '2023-02-06T04:00:00+00:00',
            end_date: '2023-02-13T04:00:00+00:00',
            circle_id: 707,
            repeat_data: {
              duration: 7,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'weeks',
            },
          },
        ],
      },
      {
        id: 504,
        name: 'Core',
        nextEpoch: [],
        lastEpoch: [
          {
            id: 13062,
            start_date: '2023-01-23T00:00:00+00:00',
            end_date: '2023-02-09T00:00:00+00:00',
            circle_id: 504,
            repeat_data: {
              duration: 17,
              frequency: 1,
              time_zone: 'UTC',
              duration_unit: 'days',
              frequency_unit: 'months',
            },
          },
        ],
      },
    ],
  },
};

const result = payload.data.circles.map(({ lastEpoch }) => {
  const last = lastEpoch.pop();
  console.log(last);
  if (last) {
    // @ts-ignore
    last.repeat_data.type = 'custom';

    return createNextEpoch(last);
  }
});

writeFileSync('./mutation.json', JSON.stringify({ objects: result }, null, 2));
