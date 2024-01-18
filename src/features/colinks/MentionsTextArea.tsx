import React from 'react';

import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';

import { client } from '../../lib/gql/client';
import { Box } from '../../ui';
import { textAreaMinHeight } from 'components/FormInputField';

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
  value = '',
  onChange,
  placeholder,
  onKeyDown,
}: {
  value: string;
  placeholder: string;
  onChange(e: { target: { value: string } }): void;
  onKeyDown?: (
    e:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
}) => {
  return (
    <Box
      className="async"
      css={{
        p: '$sm',
        background: '$formInputBackground',
        border: '1px solid $formInputBorder',
        '&:focus': {
          borderColor: '$formInputBorderFocus',
        },
        color: '$formInputPlaceholder',
        borderRadius: '$3',
        '&:focus-visible, &:focus-within': {
          outline: '2px solid $borderFocus',
          outlineOffset: '-1px',
        },
        '.mentions-input__highlighter': {
          border: 'none !important',
          lineHeight: '$short',
          overflowWrap: 'anywhere !important',
        },
        '.mentions-input': {
          fontFamily: '$display',
          lineHeight: '$short',
          border: 'none',
          height: '100%',
          minHeight: textAreaMinHeight,
          caretColor: '$link',
          pb: '$md',
          color: '$text',
          zIndex: 11,
          textarea: {
            lineHeight: '$short',
            color: '$text',
          },
        },
        '.mention': {
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
          color: '$tagSecondaryText',
          background: '$tagSecondaryBackgroundDim',
          overflowWrap: 'anywhere',
        },
        '.mentions-input__suggestions': {
          background: '$surface',
          borderRadius: '$3',
          border: '1px solid $tagSecondaryText',
          overflow: 'clip',
          boxShadow: '$shadow1',
        },
        '[role="option"]': {
          p: '$sm $md',
          background: '$surfaceNested',
          color: '$text',
          maxWidth: '14em',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          '&[aria-selected="true"]': {
            color: '$tagSecondaryText',
            background: '$tagSecondaryBackgroundDim',
          },
        },
      }}
    >
      <MentionsInput
        className="mentions-input"
        value={value}
        onChange={onChange}
        style={{}}
        placeholder={placeholder}
        maxLength={10000}
        a11ySuggestionsListLabel={'Suggested users to mention'}
        onKeyDown={onKeyDown}
        allowSpaceInQuery={true}
      >
        <Mention
          className={'mention'}
          displayTransform={(_, name) => `@${name}`}
          trigger="@"
          data={fetchUsers}
          markup={`[@__display__](/__id__)`}
          appendSpaceOnAdd={true}
        />
      </MentionsInput>
    </Box>
  );
};
