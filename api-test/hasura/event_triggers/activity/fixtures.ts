export const fixtures = {
  contribution_insert: {
    event: {
      data: {
        new: {
          circle_id: 373,
          created_at: '2023-02-08T19:25:47.755097+00:00',
          created_with_api_key_hash: null,
          deleted_at: null,
          description: '123123123',
          id: 538,
          updated_at: '2023-02-08T19:25:47.755097+00:00',
          user_id: 187,
          actor_profile_id: 187,
          private_stream: false,
        },
        old: null,
      },
      op: 'INSERT',
    },
    table: { name: 'contributions', schema: 'public' },
    trigger: { name: 'activityContributionInsert' },
  },
  user_insert: {
    event: {
      data: {
        new: {
          bio: null,
          circle_id: 15,
          created_at: '2023-02-08T19:47:32.740765',
          deleted_at: null,
          entrance: 'manual-address-entry',
          epoch_first_visit: true,
          fixed_non_receiver: false,
          fixed_payment_amount: 0,
          give_token_received: 0,
          give_token_remaining: 100,
          id: 267,
          name: 'testtt',
          non_giver: false,
          non_receiver: false,
          role: 0,
          starting_tokens: 100,
          updated_at: '2023-02-08T19:47:32.740765',
        },
        old: null,
      },
      op: 'INSERT',
    },
    table: {
      name: 'users',
      schema: 'public',
    },
    trigger: {
      name: 'activityUserInsert',
    },
  },
  epoch_insert: {
    event: {
      data: {
        new: {
          circle_id: 15,
          created_at: '2023-02-08T19:46:37.227413',
          days: null,
          description: null,
          end_date: '2023-03-08T19:46:00+00:00',
          ended: false,
          grant: 0,
          id: 47,
          notified_before_end: null,
          notified_end: null,
          notified_start: null,
          number: null,
          regift_days: 1,
          repeat: 0,
          repeat_data: null,
          repeat_day_of_month: 0,
          start_date: '2023-02-09T19:46:00+00:00',
          updated_at: '2023-02-08T19:46:37.227413',
        },
        old: null,
      },
      op: 'INSERT',
    },
    table: {
      name: 'epochs',
      schema: 'public',
    },
    trigger: {
      name: 'activityEpochInsert',
    },
  },

  invalid_payload: {
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
    trigger: { name: 'activityHandler' },
  },
};
