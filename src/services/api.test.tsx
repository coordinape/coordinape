import axios from 'axios';

import { getApiService } from './api';

test('fetch from the api', async () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');
  const api = getApiService();

  const circles = await api.getCircles();
  expect(circles).toStrictEqual([]);
});
