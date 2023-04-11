import { useState, useMemo, useEffect } from 'react';

import { Drawer, ApeAutocomplete } from 'components';
import { SKILLS } from 'config/constants';
import { useFetchCircle } from 'hooks/legacyApi';
import { Filter, Search, Collapse } from 'icons/__generated';
import { useDevMode } from 'recoilState';
import { useSelectedCircle } from 'recoilState/app';
import {
  useMapMetric,
  useMapResults,
  useMapMeasures,
  useSetAmSearch,
  useStateAmMetric,
  useStateAmEpochId,
  useMapEpochs,
} from 'recoilState/map';
import { IconButton, Text, Panel, Select, Flex } from 'ui';

import AMProfileCard from './AMProfileCard';

import { MetricEnum } from 'types';

interface MetricOption {
  label: string;
  value: MetricEnum;
}

export const AMDrawer = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [showRank, setShowRank] = useState<boolean>(false);
  const fetchCircle = useFetchCircle();

  const { circle } = useSelectedCircle();
  const setSearch = useSetAmSearch();
  const metric = useMapMetric();
  const rawProfiles = useMapResults();
  const { measures } = useMapMeasures(metric);
  const showHiddenFeatures = useDevMode();
  const [metric2, setMetric2] = useStateAmMetric();
  const amEpochs = useMapEpochs();
  const [amEpochId, setAmEpochId] = useStateAmEpochId();

  useEffect(() => {
    if (amEpochs.length === 0) return;
    setAmEpochId(amEpochs[amEpochs.length - 1]?.id);
  }, [amEpochs]);

  // ensure data is updated if we just made some allocations
  useEffect(() => {
    (async () => {
      await fetchCircle({ circleId: circle.id });
    })();
  }, []);

  const epochOptions = useMemo(() => {
    return amEpochs.length > 0
      ? [
          {
            label: 'ALL',
            value: -1,
          },
        ].concat(
          amEpochs.map(e => ({
            label: e.labelGraph,
            value: e.id,
          }))
        )
      : [];
  }, [amEpochs]);

  const profiles = useMemo(
    () =>
      [...rawProfiles].sort((pa, pb) =>
        showRank
          ? (measures.get(pb.address) ?? 0) - (measures.get(pa.address) ?? 0)
          : (pa.users[0].profile?.name ?? '') <
            (pb.users[0].profile?.name ?? '')
          ? -1
          : 1
      ),
    [rawProfiles, measures, showRank]
  );

  const metricOptions = [
    {
      label: `Number of ${circle.tokenName} received`,
      value: 'give',
    },
    {
      label: 'In Degree (# incoming links)',
      value: 'in_degree',
    },
    {
      label: 'Out Degree (# outgoing links)',
      value: 'out_degree',
    },
    {
      label: `Degree Standardization (${circle.tokenName} * #outDeg / #maxOutDeg)`,
      value: 'standardized',
    },
  ] as MetricOption[];

  const handleSetOpen = (value: boolean) => {
    if (!value) {
      setSearch('');
    }
    setOpen(value);
  };

  const onRankToggle = () => {
    setShowRank(!showRank);
  };

  if (!epochOptions || amEpochId === undefined) {
    return <div />;
  }

  return (
    <>
      <Drawer open={open} setOpen={handleSetOpen}>
        <Panel css={{ width: '100%', mb: '$md' }}>
          <Flex css={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Flex>
              <Text
                semibold
                css={{
                  color: '$headingText',
                  pb: '$sm',
                  pr: '$sm',
                }}
              >
                Filters
              </Text>
              {showHiddenFeatures && (
                <IconButton
                  onClick={onRankToggle}
                  css={{
                    height: 'auto',
                    color: showRank ? '$cta' : '',
                  }}
                >
                  <Filter size="lg" />
                </IconButton>
              )}
            </Flex>
            <IconButton onClick={() => setOpen(!open)} css={{ height: 'auto' }}>
              <Collapse size="lg" />
            </IconButton>
          </Flex>
          <Panel css={{ px: 0, gap: '$md', zIndex: 1 }}>
            <Select
              defaultValue={String(amEpochId)}
              options={epochOptions}
              onValueChange={value => setAmEpochId(Number(value))}
            />
            {showHiddenFeatures && (
              <Select
                defaultValue={metric2}
                options={metricOptions}
                onValueChange={value => setMetric2(value as MetricEnum)}
              />
            )}
          </Panel>
          <ApeAutocomplete
            onChange={setSearch}
            freeSolo
            options={SKILLS}
            color="secondary"
            placeholder="Search"
            isSelect
            InputProps={{
              endAdornment: <Search color="neutral" />,
            }}
          />
        </Panel>
        <Flex
          column
          css={{
            height: '100%',
            overflow: 'scroll',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {profiles.map(profile => (
            <AMProfileCard
              key={profile.id}
              profile={profile}
              summarize={showRank}
              circle={circle}
            />
          ))}
        </Flex>
      </Drawer>
    </>
  );
};

export default AMDrawer;
