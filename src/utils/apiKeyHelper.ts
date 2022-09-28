import { REACT_APP_HASURA_URL } from '../config/env';

const EXAMPLE_QUERY =
  'query+MyCircles+%7B%0A++circles%28limit%3A+3%29+%7B%0A++++name%0A++++organization+%7B%0A++++++name%0A++++%7D%0A++++epochs%28limit%3A+3%2C+where%3A+%7Bended%3A+%7B_eq%3A+true%7D%7D%29+%7B%0A++++++id%0A++++++end_date%0A++++++start_date%0A++++%7D%0A++++users%28limit%3A+5%2C+order_by%3A+%7Bcreated_at%3A+asc%7D%29+%7B%0A++++++id%0A++++++name%0A++++++give_token_received%0A++++++give_token_remaining%0A++++++profile+%7B%0A++++++++twitter_username%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D%0A';

export const getConsoleUrl = (authToken: string, withExample?: boolean) => {
  return `https://cloud.hasura.io/public/graphiql?endpoint=${REACT_APP_HASURA_URL}&header=Authorization:${encodeURIComponent(
    `Bearer ${authToken}`
  )}${withExample ? `&query=${EXAMPLE_QUERY}` : ''}`;
};
