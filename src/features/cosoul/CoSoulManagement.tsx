import { useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';

import { Flex, Panel, Text } from 'ui';
import { numberWithCommas } from 'utils';

import { CoSoulButton } from './CoSoulButton';
import { QueryCoSoulResult } from './getCoSoulData';
import { artWidth, artWidthMobile } from './MintPage';
import { generateRandomNumber, scrambleNumber } from './numberScramble';
import './coSoulAnimations.css';

type CoSoulData = QueryCoSoulResult;

export const CoSoulManagement = ({
  cosoul_data,
  minted,
  onMint,
}: {
  cosoul_data: CoSoulData;
  minted?: boolean;
  onMint(): void;
}) => {
  const coSoulMinted = cosoul_data.mintInfo
    ? Boolean(cosoul_data.mintInfo)
    : minted;
  const nodeRef = useRef(null);
  const pgiveScrambler = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (coSoulMinted) {
      pgiveScrambler.current?.remove();
    } else {
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
          pb: '$xl',
          mb: '$xl',
          gap: '$3xl',
          height: '450px',
          '@sm': {
            maxWidth: `${artWidthMobile}`,
            height: 'auto',
            gap: '$1xl',
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
                className="management-scramble"
                data-digits="3"
                data-text={generateRandomNumber(3)}
                css={{
                  fontWeight: 'inherit',
                  width: '1.9em',
                  mr: '$xs',
                  height: '1em',
                  overflow: 'hidden',
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
