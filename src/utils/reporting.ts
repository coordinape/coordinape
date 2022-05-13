import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { CaptureContext } from '@sentry/types';

import { GraphQLError } from '../lib/gql/__generated__/zeus';

import { DOMAIN_IS_LOCALHOST, DOMAIN_IS_PREVIEW, RENDER_APP } from './domain';

export const reportException = (
  exception: any,
  captureContext?: CaptureContext
) => {
  if (DOMAIN_IS_LOCALHOST) return;
  if (!(exception instanceof Error) && 'message' in exception) {
    return Sentry.captureException(
      new Error(exception.message),
      captureContext
    );
  } else {
    return Sentry.captureException(exception, captureContext);
  }
};

export const initSentry = () => {
  if (DOMAIN_IS_LOCALHOST) return;
  Sentry.init({
    environment: DOMAIN_IS_PREVIEW ? 'development' : 'production',
    dsn: 'https://1b672f036d56422ea7087e932011ec74@o919561.ingest.sentry.io/5863782',
    // ignoreErrors accepts regex. Strings will match partially.
    ignoreErrors: [
      'MetaMask: Received invalid isUnlocked parameter.',
      'The user rejected the request.',
      'pktAnnotationHighlighter', // https://github.com/LessWrong2/Lesswrong2/issues/1150
    ],
    integrations: [
      new Integrations.BrowserTracing(),
      new CaptureConsole({ levels: ['error'] }),
    ],
    tracesSampleRate: 0.1,
    normalizeDepth: 50,
  });
  Sentry.setTag('landing_page', !RENDER_APP);
};

export const normalizeError = (error: unknown): undefined | Error => {
  if (error instanceof GraphQLError) {
    // graphql error?
    if (error.message) {
      // this is fine
      return error;
    } else if (error.response.errors) {
      // elevate the error to the top level so sentry (and logging) can handle it better
      if (error.response.errors.length > 0) {
        // return
        error.message = error.response.errors.map(e => e.message).join('; ');
        return error;
      }
    }
  }
  return undefined;
};
