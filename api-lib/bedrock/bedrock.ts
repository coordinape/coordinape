import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { fromIni } from '@aws-sdk/credential-providers';

import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  IS_LOCAL_ENV,
} from '../config';

// Initialize Bedrock client with appropriate credentials
export const bedrock = new BedrockRuntimeClient({
  region: AWS_REGION,
  credentials: IS_LOCAL_ENV
    ? fromIni({ profile: 'bedrock' })
    : {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
});
