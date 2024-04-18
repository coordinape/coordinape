import { GemCoOutline } from 'icons/__generated';
import {
  EXTERNAL_URL_BLOG,
  EXTERNAL_URL_DOCS_GIVE,
  START_A_PARTY_INTENT,
} from 'routes/paths';
import { Flex, Link, Text } from 'ui';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

export const GiveParty = () => {
  return (
    <>
      <Flex
        column
        css={{
          height: '100vh',
          width: '100%',
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
          alignItems: 'center',
          position: 'fixed',
          overflow: 'scroll',
          paddingBottom: 100,
          '*': {
            color: 'white',
          },
        }}
      >
        <Flex
          column
          css={{
            width: '90%',
            maxWidth: 800,
            marginTop: 50,
            alignItems: 'flex-start',
            gap: 20,
          }}
        >
          <Link href={START_A_PARTY_INTENT} target="_blank">
            <Flex
              css={{
                background:
                  'radial-gradient(circle at 15% 0%, #031c5d 20%, #6e00c3 100%)',
                padding: '10px 15px',
                borderRadius: 10,
              }}
            >
              <Text
                h2
                display
                css={{
                  fontWeight: 'normal',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '.1em',
                  paddingBottom: '6px',
                  border: '2px solid',
                  borderImageSlice: '1',
                  borderWidth: '2px',
                  borderImageSource:
                    'linear-gradient(to right, rgb(15, 243, 210), rgb(0 107 255))',
                  borderLeft: '0',
                  borderRight: '0',
                  borderTop: '0',
                  flexWrap: 'wrap',
                }}
              >
                <span>https://give.party/</span>
                <PartyDisplayText text="{a-skill-to-celebrate}" />
              </Text>
            </Flex>
          </Link>
          <Text
            h1
            display
            css={{
              fontWeight: 400,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            When it comes to creating onchain reputation, we mean business.
          </Text>
          <Text
            h1
            display
            css={{
              fontWeight: 600,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            And when we mean business, we mean party!
          </Text>
          <Flex
            column
            css={{ borderTop: '1px solid #00000033', pt: '$xl', mt: '$md' }}
          >
            <Text h2 display>
              {' '}
              How does this work?
            </Text>
            <ul
              style={{
                padding: '0 1em',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: 18,
              }}
            >
              <li>
                Cast the URL{' '}
                <Link href={START_A_PARTY_INTENT} target="_blank">
                  <span
                    style={{
                      background:
                        'radial-gradient(circle at 15% 0%, rgb(38 63 219 / 72%) 20%, rgb(187 12 191 / 67%) 100%)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    https://give.party/&#x7B; a-skill &#x7D;
                  </span>{' '}
                </Link>
                on Farcaster to create a custom frame.
                <br />
                <span
                  style={{ fontSize: '.9em', marginTop: 5, display: 'block' }}
                >
                  (Replace <b>&apos;&#x7B; a-skill &#x7D;&apos;</b> with a skill
                  of your choosing)
                </span>
              </li>
              <li>
                Anyone on Farcaster can use the frame to name people who they
                think are awesome at that skill.
              </li>
              <li>
                GIVE will be sent by Coordinape to create a map of this skill
                party.
              </li>
              <li>&#x2026;</li>
              <li>
                <PartyDisplayText text="Party" />
              </li>
            </ul>
          </Flex>
          <Flex
            column
            css={{
              borderTop: '1px solid #00000033',
              pt: '$xl',
              mt: '$md',
              width: '100%',
            }}
          >
            <GemCoOutline size="2xl" fa css={{ mb: '$xl' }} />
            <Text h2>Wanna know more?</Text>
            <Flex
              column
              css={{
                gap: 10,
                pt: 10,
                a: {
                  textDecoration: 'underline',
                },
              }}
            >
              <Link inlineLink href={EXTERNAL_URL_DOCS_GIVE} target="_blank">
                Docs
              </Link>
              <Link inlineLink href={EXTERNAL_URL_BLOG} target="_blank">
                Blog
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
