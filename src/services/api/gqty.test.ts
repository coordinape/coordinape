import { query, resolved } from 'lib/gqty';

test('basic request with standalone client', async () => {
  const resp = await resolved(() =>
    query.users({ where: { name: { _eq: 'Lawris' } } }).map(user => user.id)
  );

  // staging data
  // this is obviously a bad test, but it's enough to get started
  expect(resp.sort((a: number, b: number) => a - b)).toEqual([907, 1174, 1255]);
});
