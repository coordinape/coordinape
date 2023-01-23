import { client } from 'lib/gql/client';

export const createCircleIntegration = async (
  circleId: number,
  type: string,
  name: string,
  data: any
) => {
  return client.mutate(
    {
      insert_circle_integrations_one: [
        {
          object: {
            circle_id: circleId,
            type,
            name,
            data,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'createCircleIntegration' }
  );
};

export const deleteCircleIntegration = async (id: number) =>
  client.mutate(
    { delete_circle_integrations_by_pk: [{ id }, { id: true }] },
    { operationName: 'deleteCircleIntegration' }
  );

export const updateCircleIntegration = async (id: number, data: any) => {
  return client.mutate(
    {
      update_circle_integrations_by_pk: [
        { pk_columns: { id }, _set: { data } },
        { id: true },
      ],
    },
    { operationName: 'updateCircleIntegration' }
  );
};
