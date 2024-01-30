import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ACTIVITIES_QUERY_KEY } from 'features/activities/ActivityList';
import { EpochEndingNotification } from 'features/nav/EpochEndingNotification';
import { updateEpochDescription } from 'lib/gql/mutations';
import { DateTime } from 'luxon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';
import * as z from 'zod';

import { FormInputField } from 'components';
import { useToast } from 'hooks';
import { Edit, Give, PlusCircle } from 'icons/__generated';
import { givePaths } from 'routes/paths';
import { Box, Panel, Text, Button, Flex, IconButton, HR, AppLink } from 'ui';

import { NotesSection } from './Notes';
import { useReceiveInfo } from './useReceiveInfo';

type Props = {
  epoch: {
    start_date?: any;
    end_date: any;
    id: number;
    description?: string;
    number?: number;
  };
  userId?: number;
  unallocated: number;
  circleId: number;
  tokenName?: string;
  editCurrentEpoch: () => void;
  isEditing: boolean;
  editingEpoch?: number;
  isAdmin: boolean;
  css?: CSS;
  children?: React.ReactNode;
  expanded: boolean;
};
export const CurrentEpochPanel = ({
  epoch,
  userId,
  unallocated,
  circleId,
  tokenName = 'GIVE',
  editCurrentEpoch,
  isEditing,
  isAdmin,
  children,
  css = {},
  expanded,
}: Props) => {
  const notesSectionRef = useRef<null | HTMLLabelElement>(null);
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);

  const endDateFormat = endDate.month === startDate.month ? 'd' : 'MMM d';

  const { gifts, showGives } = useReceiveInfo(circleId, userId);

  // TODO: why is epoch.number null sometimes? just from data seeding?
  const [epochDescriptionText, setEpochDescriptionText] = useState<string>(
    epoch.description ?? 'Epoch ' + (epoch.number ?? ''),
  );

  useEffect(() => {
    if (notesSectionRef.current && expanded) {
      notesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [expanded, notesSectionRef]);

  return (
    <Panel
      css={{
        p: '$lg',
        mb: '$xl',
        border: '1px solid $borderFocusBright',
        ...css,
      }}
    >
      <Flex
        row
        css={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '1fr 3fr',
          gap: '$md',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        <Flex column alignItems="start" css={{ gap: '$sm' }}>
          <Text h1 css={{ color: '$currentEpochDate' }}>
            {startDate.toFormat('MMM')} {startDate.toFormat('d')} -{' '}
            {endDate.toFormat(endDateFormat)}
          </Text>

          <EpochDescription
            description={epochDescriptionText}
            isAdmin={isAdmin}
            epochId={epoch.id}
            setDescriptionText={setEpochDescriptionText}
          />
          <Flex css={{ gap: '$sm' }}>
            {!isEditing && isAdmin && (
              <Button
                css={{ mt: '$md' }}
                color="secondary"
                size="small"
                onClick={() => editCurrentEpoch()}
              >
                Edit Epoch
              </Button>
            )}
            <Button
              color="cta"
              css={{ mt: '$md' }}
              size="small"
              as={AppLink}
              to={givePaths.map(circleId, { epochId: epoch.id })}
            >
              View Map
            </Button>
          </Flex>
        </Flex>
        <Flex
          column
          css={{
            gap: '$lg',
            borderLeft: '1px solid $border',
            pl: '$xl',
            '@sm': {
              borderLeft: 'none',
              pl: 0,
            },
          }}
        >
          <Flex
            css={{
              gap: '$md',
              '@sm': { flexDirection: 'column' },
            }}
          >
            <Minicard
              icon={<PlusCircle />}
              title="Contributions"
              path={givePaths.contributions(circleId)}
              linkLabel="Add Contribution"
            >
              <Flex alignItems="start" column css={{ gap: '$xs' }}>
                <EpochEndingNotification
                  css={{ fontWeight: '$semibold' }}
                  circleId={circleId}
                  message="Contributions Due"
                  asTag={false}
                  showCountdown
                />
              </Flex>
            </Minicard>
            <Minicard
              icon={<Give nostroke />}
              title="GIVE"
              path={givePaths.give(circleId)}
              linkLabel="GIVE to Teammates"
            >
              <Text semibold color="default">
                {unallocated > 0 && (
                  <Text semibold color="warning">
                    Allocate Your Remaining {unallocated} {tokenName}
                  </Text>
                )}
              </Text>
            </Minicard>
          </Flex>
          {(showGives || isAdmin) && (
            <NotesSection
              ref={notesSectionRef}
              sent={[]}
              received={gifts}
              tokenName={tokenName}
              expanded={expanded}
            />
          )}
        </Flex>
      </Flex>
      {children && (
        <Flex
          css={{
            '.epochFormContainer': {
              m: '$lg 0 0 0',
              px: '0',
              borderTop: '1px dashed $border',
              borderRadius: 0,
              gridColumn: '1 / 3',
            },
          }}
        >
          {children}
        </Flex>
      )}
    </Panel>
  );
};

type MinicardProps = {
  icon?: any;
  title?: string;
  children: React.ReactNode;
  path: string;
  linkLabel: string;
};

const Minicard = ({
  icon,
  title,
  children,
  path,
  linkLabel,
}: MinicardProps) => {
  return (
    <Box
      css={{
        width: '100%',
        gap: '$sm',
        '@sm': {
          minWidth: 0,
        },
      }}
    >
      <Box
        css={{
          color: '$secondaryText',
          flexGrow: 1,
          display: 'flex',
          gap: '$sm',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Text variant="label" css={{ mb: '$sm' }}>
            <Flex css={{ mr: '$xs' }}>{icon}</Flex>
            {title}
          </Text>
          {children}
        </Box>
        <Button size="small" color="primary" as={NavLink} key={path} to={path}>
          {linkLabel}
        </Button>
      </Box>
    </Box>
  );
};

type EpochDescriptionProps = {
  description: string;
  isAdmin: boolean;
  epochId: number;
  setDescriptionText: Dispatch<SetStateAction<string>>;
};
const EpochDescription = ({
  description,
  isAdmin,
  epochId,
  setDescriptionText,
}: EpochDescriptionProps) => {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const zEpochDescriptionSchema = z.object({
    description: z
      .string()
      .trim()
      .min(1, { message: 'Must be at least 1 characters long' })
      .max(100, { message: 'Must be 100 or fewer characters long' }),
  });

  type EpochDescriptionSchema = z.infer<typeof zEpochDescriptionSchema>;

  const onSubmit: SubmitHandler<EpochDescriptionSchema> = async data => {
    if (!data.description) {
      return;
    }

    try {
      setSubmitting(true);
      await updateEpochDescription(epochId, data.description);
      setDescriptionText(data.description);
      showSuccess('Epoch Description Saved!');
      queryClient.invalidateQueries(ACTIVITIES_QUERY_KEY);
    } catch (e) {
      showError(e);
      console.warn(e);
    } finally {
      setSubmitting(false);
      setEditDescription(false);
    }
  };

  const { control: epochDescriptionControl, handleSubmit } =
    useForm<EpochDescriptionSchema>({
      resolver: zodResolver(zEpochDescriptionSchema),
      mode: 'all',
    });

  return (
    <Flex css={{ width: '100%' }}>
      {!editDescription ? (
        <Flex css={{ alignItems: 'center' }}>
          <Text
            medium
            css={{
              color: '$ctaDim',
            }}
          >
            {description}
          </Text>
          {isAdmin && (
            <IconButton inlineLink onClick={() => setEditDescription(true)}>
              <Edit />
            </IconButton>
          )}
        </Flex>
      ) : (
        isAdmin && (
          <Flex
            column
            css={{
              width: '100%',
              pr: '$md',
            }}
          >
            <Box>
              <FormInputField
                css={{ width: '100%' }}
                name="description"
                id="epoch_description_edit"
                control={epochDescriptionControl}
                defaultValue={description}
                label="Epoch Description"
                showFieldErrors
                textArea
              />
            </Box>
            <Flex css={{ gap: '$sm', mt: '$md' }}>
              <Button
                size="small"
                color="secondary"
                onClick={() => {
                  setEditDescription(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                color="primary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
              >
                Save
              </Button>
            </Flex>
            <HR />
          </Flex>
        )
      )}
    </Flex>
  );
};
