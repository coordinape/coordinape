import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as z from 'zod';

import { FormDatePicker, FormInputField } from 'components';
import { useToast } from 'hooks';
import { QUERY_KEY_EDIT_BIG_QUESTION } from 'pages/colinks/EditBigQuestionsPage';
import { Button, Flex } from 'ui';

import { BigQuestion } from './useBigQuestions';

const schema = z.object({
  cover_image_url: z.string(),
  css_background_position: z.string().optional().nullable(),
  description: z.string().optional(),
  expire_at: z.string().optional(),
  prompt: z.string(),
  publish_at: z.string().optional(),
});

type BigQuestionFormSchema = z.infer<typeof schema>;

export const EditBigQuestionForm = ({
  question,
}: {
  question?: BigQuestion;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { showDefault, showError } = useToast();

  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BigQuestionFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<BigQuestionFormSchema> = async data => {
    setSubmitting(true);

    try {
      await updateBigQuestion({
        big_question_id: question?.id ?? null,
        ...data,
      });

      queryClient.invalidateQueries(QUERY_KEY_EDIT_BIG_QUESTION);
      showDefault('Saved changes');
    } catch (e) {
      showError(e);
      console.warn(e);
    }
    setSubmitting(false);
  };

  return (
    <Flex css={{ gap: '$1xl' }} column>
      <Flex css={{ gap: '$1xl' }}>
        <Flex column css={{ gap: '$1xl' }}>
          <FormInputField
            id="description"
            name="description"
            control={control}
            defaultValue={question?.description ?? ''}
            label="Description"
            showFieldErrors
          />
          <FormInputField
            id="prompt"
            name="prompt"
            control={control}
            defaultValue={question?.prompt ?? ''}
            label="Prompt"
            showFieldErrors
          />
          <FormInputField
            id="css_background_position"
            name="css_background_position"
            control={control}
            defaultValue={question?.css_background_position ?? null}
            label="CSS Background Position"
            showFieldErrors
          />
        </Flex>
        <Flex column css={{ gap: '$1xl' }}>
          <FormInputField
            id="cover_image_url"
            name="cover_image_url"
            control={control}
            defaultValue={question?.cover_image_url ?? ''}
            label="Cover Image Url"
            showFieldErrors
          />
          <FormDatePicker
            control={control}
            id="expire_at"
            name="expire_at"
            css={{
              width: '100%',
            }}
            defaultValue={DateTime.fromISO(
              question?.expire_at ?? DateTime.now().toString()
            ).toISODate()}
            label="Expire At"
          />
          <FormDatePicker
            control={control}
            id="publish_at"
            name="publish_at"
            css={{
              width: '100%',
            }}
            defaultValue={DateTime.fromISO(
              question?.publish_at ?? DateTime.now().toString()
            ).toISODate()}
            label="Publish At"
          />
        </Flex>
      </Flex>
      <Flex css={{ gap: '$sm' }}>
        <Button color="secondary" onClick={() => reset()}>
          Cancel
        </Button>
        <Button
          color="cta"
          type="submit"
          disabled={submitting || !isEmpty(errors)}
          onClick={handleSubmit(onSubmit)}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </Flex>
    </Flex>
  );
};

export async function updateBigQuestion(
  params: ValueTypes['UpdateBigQuestionInput']
) {
  const { updateBigQuestion } = await client.mutate(
    {
      updateBigQuestion: [
        {
          payload: { ...params },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateBigQuestion',
    }
  );

  return updateBigQuestion;
}
