import React, {
  ChangeEvent,
  Dispatch,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { uploadImage } from 'features/images/upload';
import { useController, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { ConfirmationModal } from '../../components/ConfirmationModal';
import { LoadingBar } from '../../components/LoadingBar';
import { MarkdownGuide } from '../../components/MarkdownGuide';
import { useToast } from '../../hooks';
import { ArrowUp, Code, Image, RefreshCcw } from '../../icons/__generated';
import {
  createContributionMutation,
  deleteContributionMutation,
  updateContributionMutation,
} from '../../pages/ContributionsPage/mutations';
import { QUERY_KEY_ALLOCATE_CONTRIBUTIONS } from '../../pages/GiftCircleGivePage/EpochStatementDrawer';
import { POST_PAGE_QUERY_KEY } from '../../pages/PostPage';
import { CSS, styled } from '../../stitches.config';
import { Box, Button, Flex, MarkdownPreview, Text } from '../../ui';
import { ACTIVITIES_QUERY_KEY } from '../activities/ActivityList';
import { Contribution } from '../activities/useInfiniteActivities';

import { MentionsTextArea } from './MentionsTextArea';

const ALLOWED_IMAGES = ['png', 'gif', 'jpg', 'jpeg', 'webp', 'svg', 'svg+xml'];
const FORM_STORAGE_KEY = 'colinks.PostForm.description';

const HiddenInput = styled('input', {
  display: 'none',
});

export const PostForm = ({
  editContribution,
  setEditingContribution,
  css,
  showLoading,
  onSave,
  onSuccess,
  placeholder = 'Take inspiration from the prompt, or post whatever you want',
  refreshPrompt,
  label,
  bigQuestionId,
}: {
  editContribution?: Contribution['contribution'];
  setEditingContribution?: Dispatch<React.SetStateAction<boolean>>;
  css?: CSS;
  showLoading?: boolean;
  onSave?: () => void;
  onSuccess?: () => void;
  placeholder?: string;
  refreshPrompt?: () => void;
  label?: React.ReactNode;
  bigQuestionId?: number;
}) => {
  const [showMarkdown, setShowMarkDown] = useState<boolean>(false);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { showError } = useToast();

  // triggers when file is dropped
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    setDragActive(false);
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleDrag = (
    e: DragEvent<HTMLDivElement> | DragEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFiles = async (fl: FileList) => {
    try {
      if (fl.length > 0) {
        const file = fl.item(0);

        const imagetype = file?.type.split('/')[1] ?? '';

        if (file && ALLOWED_IMAGES.includes(imagetype)) {
          setFileUploading(true);
          await uploadImage({
            file: file,
            setUploadProgress: setUploadProgress,
            onSuccess: (resp: any) =>
              insertMarkdownImage(
                resp?.result?.variants.find((s: string) => s.match(/feed$/))
              ),
          });
        } else {
          showError(`Error: File type ${imagetype} not supported`);
        }
      }
    } catch (e: any) {
      showError('Error uploading image: ' + e.message);
      console.error(e);
    } finally {
      setFileUploading(false);
      setUploadProgress(0);
      if (inputRef.current) {
        // reset the file input so same or different file can be selected
        inputRef.current.value = '';
      }
    }
  };

  const queryClient = useQueryClient();
  const { control, reset, resetField, getValues, setValue, setFocus } = useForm(
    {
      mode: 'all',
    }
  );

  const { field: descriptionField } = useController({
    name: 'description',
    control,
    defaultValue: editContribution?.description ?? '',
  });

  const insertMarkdownImage = (url: string) => {
    const { description } = getValues();
    // append the image in markdown to end of description
    const newDescription = description + "\n!['Uploaded Image'](" + url + ')';
    setValue('description', newDescription);
  };

  useEffect(() => {
    if (editContribution) return;

    if (getValues('description') === '') {
      const oldPost = getFormStorage();
      if (oldPost && oldPost.length > 0) {
        setValue('description', oldPost);
        removeFormStorage();
      }
    }
  }, []);

  useEffect(() => {
    if (editContribution) return;
    setFormStorage(descriptionField.value);
  }, [descriptionField.value]);

  const { mutate: createContribution, reset: resetCreateMutation } =
    useMutation(createContributionMutation, {
      onError: errors => {
        showError(errors);
      },
      onSuccess: newContribution => {
        onSuccess && onSuccess();
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY_ALLOCATE_CONTRIBUTIONS],
        });
        if (newContribution.insert_contributions_one) {
          resetField('description', { defaultValue: '' });
          removeFormStorage();
          setShowMarkDown(false);
          setFocus('description');
        } else {
          resetCreateMutation();
        }
      },
    });

  const { mutate: mutateContribution } = useMutation(
    updateContributionMutation,
    {
      mutationKey: ['updateContribution'],
      onError: errors => {
        showError(errors);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
        queryClient.invalidateQueries(POST_PAGE_QUERY_KEY);
        cancelEditing();
      },
    }
  );

  const { mutate: deleteContribution } = useMutation(
    deleteContributionMutation,
    {
      mutationKey: ['deleteContribution'],
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
      },
    }
  );

  const saveContribution = (value: string) => {
    try {
      if (editContribution) {
        mutateContribution({
          id: editContribution.id,
          description: value,
        });
      } else {
        onSave && onSave();
        createContribution({
          user_id: undefined,
          description: value,
          big_question_id: bigQuestionId,
          private_stream: !bigQuestionId,
        });
      }
    } catch (e) {
      showError(e);
    }
  };

  const cancelEditing = () => {
    if (setEditingContribution) {
      setEditingContribution(false);
    }
  };

  return (
    <>
      <>
        <Flex column css={{ width: '100%', position: 'relative' }}>
          <Flex
            css={{
              justifyContent: 'space-between',
              mb: '$xs',
              gap: '$lg',
              '@sm': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '$xs',
              },
            }}
          >
            <Text variant="label" as="label">
              {label ? label : `Share Post`}
            </Text>
            {refreshPrompt && (
              <Button
                color={'link'}
                onClick={refreshPrompt}
                size={'xs'}
                css={{
                  textDecoration: 'none',
                  color: '$secondaryText',
                  '&:hover': {
                    color: '$linkHover',
                  },
                }}
              >
                <RefreshCcw size={'sm'} /> Refresh Prompt
              </Button>
            )}
          </Flex>
          <Flex column alignItems="end" css={{ ...css, gap: '$sm' }}>
            {showMarkdown ? (
              <Box
                tabIndex={0}
                css={{ borderRadius: '$3', width: '100%' }}
                onClick={() => setShowMarkDown(false)}
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowMarkDown(false);
                  }
                }}
              >
                <MarkdownPreview asPost source={descriptionField.value} />
              </Box>
            ) : (
              <Box
                onDragEnter={handleDrag}
                css={{
                  position: 'relative',
                  width: '100%',
                }}
              >
                <HiddenInput
                  ref={inputRef}
                  accept={ALLOWED_IMAGES.map(i => '.' + i).join(',')}
                  type="file"
                  id="input-file-upload"
                  onChange={handleChange}
                />
                <MentionsTextArea
                  onChange={e => setValue('description', e.target.value)}
                  value={descriptionField.value as string}
                  placeholder={placeholder}
                  onKeyDown={e => {
                    e.stopPropagation();
                    if (e.key === 'Escape') {
                      cancelEditing();
                    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      saveContribution(descriptionField.value);
                      e.preventDefault();
                    }
                  }}
                />
                <MarkdownGuide />
                {dragActive && (
                  <Flex
                    css={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '$3',
                      top: '0px',
                      right: '0px',
                      bottom: '0px',
                      left: '0px',
                      zIndex: 9999,
                      background: '$surface',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragExit={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    Drop Image to Upload
                  </Flex>
                )}
              </Box>
            )}
            {fileUploading && (
              <Flex css={{ width: '100%', px: '$sm' }}>
                <Flex
                  css={{
                    justifyContent: 'flex-start',
                    flexGrow: 1,
                    flexDirection: 'column',
                    gap: '$sm',
                  }}
                >
                  <LoadingBar />
                  <Text display size={'small'}>
                    Uploading: {uploadProgress.toFixed(0)}% complete
                  </Text>
                </Flex>
              </Flex>
            )}

            <Flex
              css={{
                justifyContent: 'space-between',
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              <Flex>
                <Button
                  size="small"
                  color="link"
                  css={{ px: '$sm', gap: '1px', textDecoration: 'none' }}
                  disabled={
                    !(
                      descriptionField.value &&
                      descriptionField.value.length > 0
                    )
                  }
                  onClick={() => setShowMarkDown(prev => !prev)}
                >
                  {showMarkdown ? (
                    <>
                      <Code />
                      <Text>View Markdown</Text>
                    </>
                  ) : (
                    <>
                      <Image />
                      <Text>Preview</Text>
                    </>
                  )}
                </Button>

                <Button
                  size="small"
                  color="link"
                  css={{ px: '$sm', gap: '1px', textDecoration: 'none' }}
                  onClick={onButtonClick}
                  disabled={fileUploading}
                >
                  <>
                    <ArrowUp />
                    <Text>Upload Image</Text>
                  </>
                </Button>
              </Flex>
              <Flex
                css={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flexDirection: editContribution ? 'row-reverse' : 'row',
                  gap: '$md',
                  mt: '$xs',
                }}
              >
                {bigQuestionId && (
                  <Text tag color={'primary'} size={'xs'}>
                    Big Question Answers are Public
                  </Text>
                )}
                <Button
                  color="cta"
                  onClick={() => {
                    saveContribution(descriptionField.value);
                  }}
                  disabled={!descriptionField.value}
                >
                  {editContribution ? 'Save Post' : 'Add Post'}
                </Button>
                {editContribution && (
                  <>
                    <Button color="secondary" onClick={() => cancelEditing()}>
                      Cancel
                    </Button>
                    <ConfirmationModal
                      trigger={
                        <Button
                          color="transparent"
                          css={{
                            '&:hover, &:focus': {
                              color: '$destructiveButton',
                            },
                            '&:focus-visible': {
                              outlineColor: '$destructiveButton',
                            },
                            svg: { mr: 0 },
                          }}
                        >
                          Delete
                        </Button>
                      }
                      action={() => {
                        deleteContribution({
                          contribution_id: editContribution.id,
                        });
                      }}
                      description={`Are you sure you want to delete this post?`}
                      yesText="Yes, delete it!"
                    />
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
          {showLoading && (
            <LoadingBar
              css={{
                position: 'absolute',
                bottom: '-$sm',
                left: '-$xl',
                width: `calc(100% + $xl)`,
              }}
            />
          )}
        </Flex>
      </>
    </>
  );
};

const setFormStorage = (value: string) => {
  sessionStorage.setItem(formStorageKey(), value);
};

const getFormStorage = () => {
  return sessionStorage.getItem(formStorageKey());
};

const removeFormStorage = () => {
  sessionStorage.removeItem(formStorageKey());
};

const formStorageKey = () => {
  const url = window.location.pathname;
  return FORM_STORAGE_KEY + url;
};
