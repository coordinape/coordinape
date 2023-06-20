import { useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';

import { Flex, Panel, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { artWidth, artWidthMobile } from './constants';
import { CoSoulButton } from './CoSoulButton';
import { QueryCoSoulResult } from './getCoSoulData';
import { generateRandomNumber, scrambleNumber } from './numberScramble';

import './glitch.css';

type CoSoulData = QueryCoSoulResult;

export const CoSoulCreate = ({
  cosoul_data,
  minted,
  onMint,
}: {
  cosoul_data: CoSoulData;
  minted?: boolean;
  onMint(): void;
}) => {
  const coSoulMinted = Boolean(cosoul_data.mintInfo ?? minted);
  const pgiveScrambler = useRef<HTMLSpanElement>(null);
  const nodeRef = useRef(null);
  useEffect(() => {
    if (coSoulMinted) {
      pgiveScrambler.current?.remove();
    } else if (pgiveScrambler.current) {
      scrambleNumber(pgiveScrambler.current);
    }
  }, [coSoulMinted, pgiveScrambler]);
  return (
    <CSSTransition
      in={!coSoulMinted}
      nodeRef={nodeRef}
      timeout={500}
      classNames="management"
      unmountOnExit
      appear
    >
      <Panel
        ref={nodeRef}
        css={{
          justifyContent: 'space-between',
          borderColor: '$cta',
          width: '100%',
          minWidth: '180px',
          maxWidth: `${artWidth}`,
          // height: '440px',
          pb: '$xl',
          mb: '$xl',
          gap: '$3xl',
          '@sm': {
            maxWidth: `${artWidthMobile}`,
            height: 'auto',
            gap: '$1xl',
          },
          '&.management-exit, &.management-exit-active': {
            overflow: 'hidden',
            transition: 'all 500ms',
            opacity: '0.2',
            height: '0',
            gap: '0',
            padding: '0 16px',
            margin: '0',
          },
        }}
      >
        <Flex column css={{ gap: '$sm' }}>
          <Text variant="label">{"You've Earned"}</Text>
          <Text h2 display>
            {!coSoulMinted && (
              <Text
                ref={pgiveScrambler}
                color="cta"
                className="management-scramble glitch glitch5"
                data-digits="3"
                data-text={generateRandomNumber(3)}
                css={{
                  fontWeight: 'inherit',
                  width: '1.9em',
                  maxHeight: '1.2em',
                  m: '0 $xs 0 0 !important',
                  overflow: 'hidden',
                  background: '$surface !important',
                  '&:after, &:before': {
                    background: '$surface !important',
                  },
                }}
              >
                {generateRandomNumber(3)}
                &nbsp;
              </Text>
            )}
            {coSoulMinted && (
              <Text
                color="cta"
                css={{
                  fontWeight: 'inherit',
                }}
              >
                {numberWithCommas(cosoul_data.totalPgive, 0)}
                &nbsp;
              </Text>
            )}
            Public GIVE
          </Text>
          {!coSoulMinted && (
            <Text tag color="primary" css={{ mt: '$sm', mb: '$md' }}>
              Mint to reveal your stats and art
            </Text>
          )}
          <Text color="secondary">
            pGIVE is an abstraction of the GIVE you have received in Coordinape.
          </Text>
          <Text color="secondary">
            pGIVE auto-syncs to your minted CoSoul every month.
          </Text>
          <Text color="secondary">
            Minting will create a public view of your stats, username, and
            organization/circle names; similar to what is displayed below.
          </Text>
        </Flex>
        <Flex column css={{ gap: '$sm' }}>
          <CoSoulButton onMint={onMint} />
          <Text color="secondary">
            There are no fees to mint CoSouls, and gas costs are minimal.
          </Text>
        </Flex>
      </Panel>
    </CSSTransition>
  );
};
