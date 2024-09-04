import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from 'features/images/upload';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as z from 'zod';

import { FormDatePicker, FormFileUpload, FormInputField } from 'components';
import { useImageUploader, useToast } from 'hooks';
import { QUERY_KEY_EDIT_BIG_QUESTION } from 'pages/colinks/EditBigQuestionsPage';
import { Box, Button, Flex } from 'ui';

import { BigQuestion } from './useBigQuestions';

const schema = z.object({
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
  const [coverImageUrl, setCoverImageUrl] = useState(
    question?.cover_image_url ?? ''
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BigQuestionFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { imageUrl, formFileUploadProps } = useImageUploader(coverImageUrl);
  const updateCoverImage = async (newCoverImage: File) => {
    await uploadImage({
      file: newCoverImage,
      onSuccess: async (resp: any) => {
        const newCoverImage = resp.result.variants.find((s: string) =>
          s.match(/original$/)
        );
        setCoverImageUrl(newCoverImage);
      },
    });
  };

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<BigQuestionFormSchema> = async data => {
    setSubmitting(true);

    try {
      await updateBigQuestion({
        big_question_id: question?.id ?? null,
        cover_image_url: coverImageUrl ?? '',
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

  const handleCommit = async (file: File) => {
    if (formFileUploadProps.hasChanged) {
      await updateCoverImage(file);
      formFileUploadProps.onChange(undefined);
    }
  };

  return (
    <Flex css={{ gap: '$1xl' }} column>
      <Flex
        row
        css={{
          height: '100%',
          width: '100%',
          minHeight: '240px',
          background: imageUrl ? `url(${imageUrl})` : 'white',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${question?.css_background_position ?? 'center'}`,
          backgroundSize: 'cover',
        }}
      >
        <Box css={{ alignSelf: 'flex-end', m: '$lg' }}>
          <FormFileUpload
            editText="Edit Background"
            uploadText="Upload Background"
            {...formFileUploadProps}
            commit={handleCommit}
            accept="image/gif, image/jpeg, image/png"
          />
        </Box>
      </Flex>
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
