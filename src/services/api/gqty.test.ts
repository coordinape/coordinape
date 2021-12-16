import { query, resolved, axios } from 'lib/gqty';

let interceptor: number;

beforeEach(() => {
  interceptor = axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${process.env.TESTING_AUTH_TOKEN}`;
    return config;
  });
});

afterEach(() => {
  axios.interceptors.request.eject(interceptor);
});

// this is a bad test that depends upon specific data in staging
// just keeping it around for sanity-checking while we sort out Hasura DX
xtest('basic request with standalone client', async () => {
  const resp = await resolved(() =>
    query.users({ where: { name: { _eq: 'Lawris' } } }).map(user => user.id)
  );

  expect(resp.sort((a: number, b: number) => a - b)).toEqual([907, 1174, 1255]);
});
