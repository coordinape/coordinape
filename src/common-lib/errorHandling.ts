// We don't want to actually import from zeus due the difference in api-lib vs src versions of zeus
// (node vs browser have different dependencies) so we have this generic interface.

export interface GQLError {
  message: string;
  response: GQLResponse;
  stack: string | undefined;
}

interface GQLResponse {
  errors?: Array<{
    message: string;
    extensions: {
      path: string;
      code: string;
    };
  }>;
}

interface GQLErrorDetails {
  path?: string;
  code?: string;
  miscError?: unknown;
}

export class FlattenedGQLError extends Error {
  causeMessage?: string;
  constructor(message: string, cause?: any) {
    super(message);
    if (cause && cause.message) {
      this.causeMessage = cause.message;
    }
    if (cause && cause.stack) {
      this.stack = cause.stack;
    }
  }
  details?: GQLErrorDetails;

  userDisplayableString(): string {
    let msg = 'GQL Error';
    if (this.details?.code) {
      msg = msg + ' (' + this.details.code + '): ';
    } else {
      msg = msg + ': ';
    }

    msg = msg + this.message;

    if (this.details?.path) {
      msg = msg + ' at ' + this.details.path + '';
    }
    return msg;
  }
}

export function flattenZeusError(gqle: GQLError): FlattenedGQLError {
  const res: GQLResponse | undefined = gqle.response as GQLResponse;
  if (!res) {
    const ue = new FlattenedGQLError(gqle.message, gqle);
    return ue;
  }

  let msg = 'GraphQL Error';
  let path = 'empty';
  let code = '';
  const miscError: any =
    res.errors && res.errors.length > 0 ? res.errors[0].extensions : {};
  if (res.errors) {
    msg = res.errors.map(err => err.message).join('; ');
    path = res.errors.map(err => err.extensions.path).join('; ');
    code = res.errors.map(err => err.extensions.code).join('; ');
  }
  const ue = new FlattenedGQLError(msg, gqle);

  if (miscError.details) {
    // if we already have details, that means this has been flattened already
    // e.g. if the server flattens it and now the client is trying to
    ue.details = miscError.details;
  } else {
    ue.details = {
      ...miscError,
      path,
      code,
    };
  }
  return ue;
}
