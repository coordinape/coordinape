import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMyUser } from 'features/auth/useLoginData';
import { updateCircle } from 'lib/gql/mutations';
import { isUserAdmin } from 'lib/users';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { z } from 'zod';

import { FormInputField } from 'components';
import { useToast } from 'hooks';
import { Edit3 } from 'icons/__generated';
import { Flex, Text, Link, Box, MarkdownPreview, Button } from 'ui';

import { getContributionsAndEpochs } from './queries';

const schema = z.object({
  cont_help_text: z

    .string()
    .max(500)
    .refine(val => val.trim().length >= 1, {
      message: 'Please write something',
    }),
});
type contributionTextSchema = z.infer<typeof schema>;
export const CONT_DEFAULT_HELP_TEXT =
  'Let your team know what you have been doing by adding a contribution.';

export const ContributionHelpText = ({ circleId }: { circleId: number }) => {
  const me = useMyUser(circleId);
  const address = me?.address;
  const isAdmin = isUserAdmin(me);
  const { showError } = useToast();
  const { data } = useQuery(
    ['contributions', circleId],
    () =>
      getContributionsAndEpochs({
        circleId: circleId,
        userAddress: address,
      }),
    {
      enabled: !!(circleId && address),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      select: data => {
        return {
          ...data,
        };
      },
    }
  );
  const [editHelpText, setEditHelpText] = useState(false);
  const [updatedContHelpText, setUpdatedContHelpText] = useState<
    string | undefined
  >();
  const { control: contributionTextControl, handleSubmit } =
    useForm<contributionTextSchema>({
      resolver: zodResolver(schema),
      mode: 'all',
    });
  const onSubmit: SubmitHandler<contributionTextSchema> = async data => {
    try {
      await updateCircle({
        circle_id: circleId,
        cont_help_text: data.cont_help_text,
      });
      setUpdatedContHelpText(data.cont_help_text);
    } catch (e) {
      showError(e);
      console.warn(e);
    }
    setEditHelpText(false);
  };
  return (
    <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
      {!editHelpText ? (
        <Flex column>
          <MarkdownPreview
            render
            source={
              updatedContHelpText ??
              data?.circles_by_pk?.cont_help_text ??
              CONT_DEFAULT_HELP_TEXT
            }
            css={{ minHeight: '0', cursor: 'auto' }}
          />

          {isAdmin && (
            <Link
              href="#"
              iconLink
              onClick={() => setEditHelpText(true)}
              css={{ whiteSpace: 'nowrap' }}
            >
              <Edit3 />
              Edit
            </Link>
          )}
        </Flex>
      ) : (
        <Flex column css={{ width: '100%' }}>
          <Box css={{ position: 'relative', width: '100%' }}>
            <FormInputField
              name="cont_help_text"
              id="finish_work"
              control={contributionTextControl}
              defaultValue={data?.circles_by_pk?.cont_help_text}
              label="Contribution Help Text"
              placeholder={`Default: ${CONT_DEFAULT_HELP_TEXT}`}
              infoTooltip="Change the text that contributors see on this page."
              showFieldErrors
              textArea
              css={{ width: '100%' }}
            />
            <Text
              inline
              size="small"
              color="secondary"
              css={{ position: 'absolute', right: '$sm', bottom: '$sm' }}
            >
              Markdown Supported
            </Text>
          </Box>
          <Flex css={{ gap: '$sm', mt: '$md' }}>
            <Button
              size="small"
              color="secondary"
              onClick={() => setEditHelpText(false)}
            >
              Cancel
            </Button>
            <Button
              size="small"
              color="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
