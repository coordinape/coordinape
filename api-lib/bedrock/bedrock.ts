import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

import {
  BEDROCK_AWS_ACCESS_KEY_ID,
  BEDROCK_AWS_REGION,
  BEDROCK_AWS_SECRET_ACCESS_KEY,
} from '../config';

// Initialize Bedrock client with appropriate credentials
export const bedrock = new BedrockRuntimeClient({
  region: BEDROCK_AWS_REGION,
  credentials: {
    accessKeyId: BEDROCK_AWS_ACCESS_KEY_ID!,
    secretAccessKey: BEDROCK_AWS_SECRET_ACCESS_KEY!,
  },
});
