import { client } from 'lib/gql/client';

type orgData = {
  name?: string;
  telegram_id?: string;
};

export const updateOrg = (orgId: number, data: orgData) => {
  return client.mutate(
    {
      update_organizations_by_pk: [
        {
          _set: { ...data },
          pk_columns: { id: orgId },
        },
        { id: true },
      ],
    },
    {
      operationName: 'updateOrg',
    }
  );
};
