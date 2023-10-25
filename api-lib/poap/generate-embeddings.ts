import { adminClient } from '../gql/adminClient';
import { createEmbedding } from '../openai';

const getPoapEvents = async () => {
  const { poap_events } = await adminClient.query(
    {
      poap_events: [
        {
          where: {
            embedding: { _is_null: true },
          },
          limit: 20,
        },
        {
          id: true,
          name: true,
          description: true,
          country: true,
          city: true,
          year: true,
          event_url: true,
        },
      ],
    },
    {
      operationName: 'fetchPoapEvents__genEmbeddings',
    }
  );

  return poap_events;
};

export async function generateEmbeddings() {
  // Fetch all the poap_events from the database that do not have an embedding, and iterate over them storing the embedding for their data.

  if (!process.env.OPENAI_API_KEY) {
    return console.error(
      'Environment variables OPENAI_API_KEY are required: skipping embeddings generation'
    );
  }

  const poap_events = await getPoapEvents();
  for (const poap_event of poap_events) {
    // use poap name and description ONLY for input to embedding
    // TODO: store this clearly, or the checksum of it
    const embedding_input = poap_event.name + ' ' + poap_event.description;

    // OpenAI recommends replacing newlines with spaces for best results (specific to embeddings)
    const input = JSON.stringify(embedding_input).replace(/\n/g, ' ');

    const embedding = await createEmbedding(input);

    const { update_poap_events_by_pk } = await adminClient.mutate(
      {
        update_poap_events_by_pk: [
          {
            pk_columns: {
              id: poap_event.id,
            },
            _set: {
              embedding: JSON.stringify(embedding),
            },
          },
          {
            id: true,
          },
        ],
      },
      {
        operationName: 'updatePoapEventEmbedding',
      }
    );
    // eslint-disable-next-line no-console
    console.log(
      'Generated embedding for poap event id:',
      update_poap_events_by_pk?.id
    );
  }
}
