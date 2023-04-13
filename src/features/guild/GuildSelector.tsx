import React, { Dispatch, useEffect, useState } from 'react';

import { Control } from 'react-hook-form';

import { FormInputField } from '../../components';
import { Box, Select, Text } from '../../ui';

import { fetchGuildInfo } from './fetchGuildInfo';
import { Guild } from './Guild';
import { GuildInfoWithMembership } from './guild-api';

// TODO: this was used for generics but I couldn't get it to work properly
// interface ControlSchema {
//   guild_id?: number | string;
//   guild_role_id?: number;
// }
export const GuildSelector = function ({
  guildInput,
  guildInfo,
  formControl,
  register,
  guild_role_id,
  setValue,
  setGuildInfo,
  guild_id,
  isOrg = false,
}: {
  formControl: Control<any>; // TODO: this any is troubling, I couldn't get generics to work properly
  guildInput: string | number | undefined;
  guildInfo?: GuildInfoWithMembership;
  setGuildInfo: Dispatch<
    React.SetStateAction<GuildInfoWithMembership | undefined>
  >;
  register(id: string): Record<string, unknown>;
  guild_role_id?: number;
  guild_id?: number;
  setValue(id: string, value: string, options: { shouldDirty: boolean }): void;
  isOrg?: boolean;
}) {
  const [guildError, setGuildError] = useState<string | undefined>(undefined);
  const [guildLoading, setGuildLoading] = useState<boolean>(false);

  useEffect(() => {
    setGuildError(undefined);
    if (guildInput) {
      loadGuild(guildInput);
    } else {
      setGuildInfo(undefined);
    }
  }, [guildInput]);

  useEffect(() => {
    if (guild_id) {
      loadGuild(guild_id);
    }
  }, [guild_id]);

  const loadGuild = (guildId: string | number) => {
    setGuildLoading(true);
    setGuildInfo(undefined);
    fetchGuildInfo(guildId)
      .then(g => {
        if (guildInput == guild_id) {
          // if this is first load, lets be nice and put the name in there
          setValue('guild_id', g.url_name, { shouldDirty: false });
        }
        setGuildInfo(g);
      })
      .catch(() => {
        setGuildInfo(undefined);
        setGuildError('Guild not found');
      })
      .finally(() => {
        setGuildLoading(false);
      });
  };

  return (
    <>
      <FormInputField
        id="guild_id"
        name="guild_id"
        control={formControl}
        placeholder="https://guild.xyz/your-guild - URL or unique Guild ID"
        defaultValue={guild_id ? '' + guild_id : ''}
        label={
          'Connect a Guild that will grant the ability to join this ' +
          (isOrg ? 'Organization' : 'Circle')
        }
        description=""
        showFieldErrors
      />
      {guildInput && (
        <Box css={{ mt: '$md' }}>
          {guildLoading ? (
            <Text>Checking guild...</Text>
          ) : guildInfo ? (
            <Box>
              <Text variant="label" css={{ mb: '$sm' }}>
                Allow members of this Guild to join
              </Text>
              <Guild info={guildInfo} />
              <Box css={{ mt: '$md' }}>
                <Select
                  {...(register('guild_role_id'),
                  {
                    onValueChange: value => {
                      setValue('guild_role_id', value, {
                        shouldDirty: true,
                      });
                    },
                    defaultValue: guild_role_id ? '' + guild_role_id : '-1',
                  })}
                  id="guild_role_id"
                  options={[
                    {
                      label: `Any Role - ${guildInfo.member_count} members`,
                      value: '-1',
                    },
                    ...guildInfo.roles.map(r => ({
                      value: '' + r.id,
                      label: r.name + ` - ${r.member_count} members`,
                    })),
                  ]}
                  label="Required Guild Role"
                  disabled={!guildInfo}
                />
              </Box>
            </Box>
          ) : guildError ? (
            <Text color="alert">{guildError}</Text>
          ) : (
            <Text>No guild connected.</Text>
          )}
        </Box>
      )}
    </>
  );
};
