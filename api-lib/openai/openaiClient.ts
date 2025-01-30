import OpenAI from 'openai';

function openai_client(custom_headers?: Record<string, string>) {
  const defaultHeaders = {
    'Helicone-Auth': 'Bearer ' + process.env.HELICONE_API_KEY,
    'Helicone-Cache-Enabled': 'true',
    'Helicone-Property-App': 'coordinape.com',
  };

  return new OpenAI({
    baseURL: 'https://oai.hconeai.com/v1',
    defaultHeaders: { ...defaultHeaders, ...custom_headers },
  });
}

export default openai_client;
