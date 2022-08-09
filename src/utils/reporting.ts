import { CaptureConsole } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { CaptureContext } from '@sentry/types';

import { flattenZeusError, GQLError } from '../common-lib/errorHandling';
import { GraphQLError } from '../lib/gql/__generated__/zeus';

import { DOMAIN_IS_LOCALHOST, DOMAIN_IS_PREVIEW } from './domain';

export const reportException = (
  error: any,
  captureContext?: CaptureContext
) => {
  if (DOMAIN_IS_LOCALHOST) return;

  Sentry.withScope(scope => {
    if (error.details) {
      scope.setExtra('details', error.details);
      if (error.details.path) {
        scope.addBreadcrumb({
          category: 'query-path',
          message: error.details.path,
          level: Sentry.Severity.Debug,
        });
      }
    }
    if (error.causeMessage) {
      scope.setExtra('cause', error.causeMessage);
    }
    if (error instanceof Error) {
      Sentry.captureException(error, captureContext);
    } else if (error.message) {
      // Sentry much prefers an Error object to a string/object
      Sentry.captureException(new Error(error.message), captureContext);
    } else {
      // No idea what's going on here so at least get an error with a string in it
      Sentry.captureException(new Error(JSON.stringify(error)), captureContext);
    }
  });
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
      'Failed to login Waiting for signature, timed out.',
      'Error: Failed to get a login token', // This happens even when a user denies signature
      'Failed to login',
      'Authentication hook unauthorized this request',
    ],
    integrations: [
      new Integrations.BrowserTracing(),
      new CaptureConsole({ levels: ['error'] }),
    ],
    tracesSampleRate: 0.1,
    normalizeDepth: 50,
  });
  Sentry.setTag('application', 'web');
};

export const normalizeError = (error: any): any => {
  if (error instanceof GraphQLError) {
    return flattenZeusError(error as GQLError);
  }
  return error;
};
