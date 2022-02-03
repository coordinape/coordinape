import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

export const validateVerificationKey = (handler: VercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      if (
        !req.headers.verification_key ||
        (req.headers.verification_key as string) !==
          process.env.HASURA_EVENT_SECRET
      ) {
        throw new Error('Unauthorized access');
      }
    } catch (error) {
      // return here to prevent further execution
      return res.status(400).json({
        message: error.message,
        code: error.message,
      });
    }
    try {
      await handler(req, res);
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: 'internal error: ' + error,
      });
    }
  };
};
