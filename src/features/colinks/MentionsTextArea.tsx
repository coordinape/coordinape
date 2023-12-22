import React from 'react';

import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

import { client } from '../../lib/gql/client';
import { Box } from '../../ui';

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
  placeholder,
}: {
  value: string;
  placeholder: string;
  onChange(e: { target: { value: string } }): void;
}) => {
  return (
    <Box
      className="async"
      css={{
        '.mentions-input__highlighter': {
          border: 'none !important',
        },
        '.mentions-input': {
          fontFamily: '$display',
          border: 'none',
        },
        '.mention': {
          position: 'relative',
          zIndex: 1,
          color: '$link',
          pointerEvents: 'none',
          background: '$surfaceNested',
        },
        '.mentions-input__suggestions': {
          background: '$surface',
          borderRadius: '$1',
          boxShadow: '$1',
          border: '1px solid $border',
          overflow: 'clip',
        },
        '[role="option"]': {
          background: '$surface',
          p: '$sm',
          '&[aria-selected="true"]': {
            background: '$surfaceNested',
            color: '$link',
          },
        },
        // '.mentions-input': textAreaStyles,
      }}
    >
      <MentionsInput
        className="mentions-input"
        value={value}
        onChange={onChange}
        style={{}}
        placeholder={placeholder}
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
