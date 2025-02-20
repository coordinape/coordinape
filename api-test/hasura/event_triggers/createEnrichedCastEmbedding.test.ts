import { VercelRequest, VercelResponse } from '@vercel/node';
import { Mock, vi } from 'vitest';

import { createEmbedding } from '../../../api-lib/bedrock/createEmbedding';
import handler from '../../../api-lib/event_triggers/createEnrichedCastEmbedding';
import { adminClient } from '../../../api-lib/gql/adminClient';

vi.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { mutate: vi.fn() },
}));

vi.mock('../../../api-lib/bedrock/createEmbedding', () => ({
  createEmbedding: vi.fn(),
}));

describe('#createEnrichedCastEmbedding', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('throws an error on unknown table name', async () => {
    const req = { body: { table: { name: 'unknown_table' } } } as VercelRequest;
    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unexpected error',
        extensions: expect.objectContaining({
          code: '500',
        }),
      })
    );
  });

  test('processes enriched_casts insert and updates the record', async () => {
    (createEmbedding as Mock).mockResolvedValue([0.1, 0.2, 0.3]);

    const req = {
      body: {
        table: { name: 'enriched_casts' },
        event: { data: { new: { id: 1, text: 'sample text' } } },
      },
    } as VercelRequest;

    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(createEmbedding as Mock).toBeCalledWith('sample text');
    expect(adminClient.mutate as Mock).toBeCalledWith(
      expect.objectContaining({
        update_enriched_casts_by_pk: expect.any(Array),
      }),
      { operationName: 'updateEnrichedCastEmbedding' }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'enriched cast embedding recorded',
    });
  });
});
