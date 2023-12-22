import React from 'react';

import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

import { client } from '../../lib/gql/client';
import { Box, textAreaStyles } from '../../ui';

async function fetchUsers(
  query: string,
  callback: (data: SuggestionDataItem[]) => void
) {
  if (!query) return;
  const { profiles_public } = await client.query(
    {
      profiles_public: [
        {
          where: {
            name: {
              _ilike: `%${query}%`,
            },
            links_held: {
              _gt: 0,
            },
          },
          limit: 10,
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'fetchMentionables',
    }
  );
  callback(
    profiles_public?.map(p => ({
      id: p.address ?? '',
      display: p.name,
    })) ?? []
  );
}

export const MentionsTextArea = ({
  value,
  onChange,
}: {
  value: string;
  onChange(e: { target: { value: string } }): void;
}) => {
  return (
    <Box
      className="async"
      css={{
        '.mention': {
          background: 'red',
        },
        '[role="option"]': {
          background: 'green',
        },
        '.mentions-input': textAreaStyles,
      }}
    >
      <MentionsInput
        className="mentions-input"
        value={value}
        onChange={onChange}
        style={{}}
        placeholder="Mention any Github user by typing `@` followed by at least one char"
        a11ySuggestionsListLabel={'Suggested Github users for mention'}
      >
        <Mention
          className={'mention'}
          displayTransform={(_, name) => `@${name}`}
          trigger="@"
          data={fetchUsers}
          markup={`[@__display__](/__id__)`}
          // style={defaultMentionStyle}
        />
      </MentionsInput>
    </Box>
  );
};
