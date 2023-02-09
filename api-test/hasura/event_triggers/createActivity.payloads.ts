export const contributions_payload = {
  event: {
    data: {
      new: {
        circle_id: 373,
        created_at: '2023-02-08T19:25:47.755097+00:00',
        created_with_api_key_hash: null,
        datetime_created: '2023-02-08T19:25:47.755097+00:00',
        deleted_at: null,
        description: '123123123',
        id: 538,
        updated_at: '2023-02-08T19:25:47.755097+00:00',
        user_id: 187,
      },
      old: null,
    },
    op: 'INSERT',
  },
  table: { name: 'contributions', schema: 'public' },
  trigger: { name: 'createActivity' },
};

export const invalid_payload = {
  event: {
    data: {
      new: {
        user_id: 187,
      },
      old: null,
    },
    op: 'INSERT',
  },
  table: { name: 'unknown', schema: 'public' },
  trigger: { name: 'createActivity' },
};
