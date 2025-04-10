import { useState } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { Mock, vi } from 'vitest';

import { TestWrapper } from '../../utils/testing';

import { GuildInfoWithMembership } from './guild-api';
import { GuildSelector } from './GuildSelector';

vi.spyOn(global, 'fetch').mockImplementation(vi.fn());

const Harness = ({
  guild_id,
  setValue = vi.fn(),
}: {
  guild_id?: number;
  setValue?: Mock<any, any>;
}) => {
  const [guildInfo, setGuildInfo] = useState<GuildInfoWithMembership>();

  const { control, watch } = useForm<{ guild_id: number | string | undefined }>(
    {
      defaultValues: {
        guild_id,
      },
    }
  );

  const guildWatch = watch('guild_id');

  return (
    <>
      <GuildSelector
        formControl={control}
        setGuildInfo={setGuildInfo}
        guildInfo={guildInfo}
        guildInput={guildWatch}
        guild_id={guild_id}
        register={vi.fn()}
        setValue={setValue}
        isOrg={true}
      />
    </>
  );
};

test('renders with no guild connected (for org)', async () => {
  await act(async () => {
    await render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });
  await screen.findByText(/Connect a Guild/);
});

// write a test for the case where the guild is connected
test('renders with guild connected (for org)', async () => {
  const user = userEvent.setup();
  const fetchMock = fetch as unknown as Mock;
  fetchMock.mockImplementationOnce(async () => {
    return {
      json: async () => ({
        id: 109,
        name: 'cool donkeys',
        urlName: 'donks',
        description: 'string',
        imageUrl: 'string',
        memberCount: 6,
      }),
    };
  });

  fetchMock.mockImplementationOnce(async () => {
    return {
      json: async () => [
        {
          guildId: 109,
          isOwner: true,
          userId: 123,
        },
      ],
    };
  });

  fetchMock.mockImplementationOnce(async () => {
    return {
      json: async () => [
        {
          name: 'Captain',
          imageUrl: 'string',
          id: 1009,
          memberCount: 1,
        },
        {
          name: 'Rando',
          imageUrl: 'string',
          id: 2,
          memberCount: 99,
        },
      ],
    };
  });

  const mockSet = vi.fn();

  await act(async () => {
    await render(
      <TestWrapper>
        <Harness guild_id={109} setValue={mockSet} />
      </TestWrapper>
    );
  });

  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.guild.xyz/v2/guilds/109',
    expect.anything()
  );
  await screen.findByText(/cool donkeys/, {}, { timeout: 1000 });

  screen.getByText(/Any Role - 6 Members/i);
  const selecty = screen.getByRole('combobox');
  await user.click(selecty);
  screen.getByRole('option', { name: 'Rando - 99 members' });
  const captain = screen.getByRole('option', { name: 'Captain - 1 members' });

  await user.click(captain);

  expect(mockSet.mock.calls[0]).toEqual([
    'guild_id',
    'donks',
    { shouldDirty: false },
  ]);
  expect(mockSet.mock.calls[1]).toEqual([
    'guild_role_id',
    '1009',
    { shouldDirty: true },
  ]);
});
