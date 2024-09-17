import { useEffect, useState } from 'react';

import copy from 'copy-to-clipboard';
import { disabledStyle } from 'stitches.config';
import { z } from 'zod';

import { useToast } from 'hooks';
import { Copy, GemCoOutline, Wand } from 'icons/__generated';
import { EXTERNAL_URL_BLOG, EXTERNAL_URL_DOCS_GIVE } from 'routes/paths';
import { Button, Flex, Link, Text, TextField } from 'ui';
import { PartyDisplayText } from 'ui/Tooltip/PartyDisplayText';

const skillSchema = z
  .string()
  .trim()
  .min(1, { message: 'Skill must not be empty' })
  .max(32, { message: 'Skill is max 32 characters' })
  .regex(/^[^\s]*$/, {
    message: 'Skill must not contain any spaces.',
  });

const usernameSchema = z
  .string()
  .trim()
  .regex(/^[^\s]*$/, {
    message: 'Username must not contain any spaces.',
  })
  .min(1, { message: 'Username must not be empty' })
  .max(24, { message: 'Username is max 24 characters' });

export const GiveParty = () => {
  const [activeTab, setActiveTab] = useState<'giveParty' | 'surpriseParty'>(
    'giveParty'
  );

  return (
    <Flex
      column
      css={{
        p: '$lg',
        gap: '$xl',
      }}
    >
      <Text h1>{`There are Two Ways to Party!`}</Text>

      <Flex css={{ flexDirection: 'row', gap: '$md' }}>
        <Button
          onClick={() => setActiveTab('giveParty')}
          // outlined={true}
          css={{ opacity: activeTab === 'giveParty' ? 1.0 : 0.5 }}
        >
          Skill Party
        </Button>
        <Button
          onClick={() => setActiveTab('surpriseParty')}
          // outlined={true}
          css={{ opacity: activeTab === 'surpriseParty' ? 1.0 : 0.5 }}
        >
          Individual Party
        </Button>
      </Flex>
      {activeTab === 'surpriseParty' && <StartSurpriseParty />}
      {activeTab === 'giveParty' && <StartGiveParty />}

      <Flex
        column
        css={{
          mt: '$3xl',
          pt: '$3xl',
          pb: '$1xl',
          borderTop: '1px solid #00000033',
          gap: '20px',
          alignItems: 'flex-start',
        }}
      >
        <Text
          h2
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
          h2
          display
          css={{
            fontWeight: 600,
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          And when we mean business,
          <br />
          we mean party!
        </Text>
      </Flex>
      <Flex
        column
        css={{ borderTop: '1px solid #00000033', pt: '$xl', mt: '$md' }}
      >
        <Text h1> How does this work?</Text>
        <ul
          style={{
            padding: '0 1em',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontSize: 22,
            lineHeight: 1.2,
          }}
        >
          <li>Cast the URL to start a GIVE Party</li>
          <li>
            <strong>Skill Party</strong> - Celebrate a skill. Anyone on
            Farcaster can use the frame to name people who they think are
            awesome at that skill.
          </li>
          <li>
            <strong>Individual Party </strong> - Celebrate an individual. Anyone
            on Farcaster can use the frame to celebrate the skills of a specific
            user.
          </li>
          <li>
            Party Starters will get Coordinape Rep Points for their parties!
            Every party gets a little, really big parties get a lot.
          </li>
          <li>
            GIVE will be sent by Coordinape to create a map of this skill party.
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
  );
};

const StartGiveParty = () => {
  const words = ['design', 'leadership', 'humor', 'inspiration', 'yolo-ing'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [skill, setSkill] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<string | undefined>(undefined);

  const startPartyUrl = `https://warpcast.com/~/compose?text=https://give.party/${skill}&embeds[]=https://give.party/${skill}`;

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (charIndex < currentWord.length) {
      const timer = setTimeout(() => {
        setDisplayedText(displayedText + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      }, 50); // Adjust speed of typing here
      return () => clearTimeout(timer);
    } else {
      const nextWordTimer = setTimeout(() => {
        setWordIndex((wordIndex + 1) % words.length);
        setDisplayedText('');
        setCharIndex(0);
      }, 2000); // Adjust pause between words here
      return () => clearTimeout(nextWordTimer);
    }
  }, [charIndex, displayedText, wordIndex, words]);

  const validate = (value: string) => {
    const result = skillSchema.safeParse(value);
    if (!result.success) {
      setErrors(result.error.issues[0].message);
    } else {
      setErrors(undefined);
    }
    setSkill(value);
  };

  const { showDefault } = useToast();

  const copyToClip = () => {
    copy(`https://give.party/${skill}`);
    showDefault(`Copied URL to clipboard`, {
      toastId: 'copyCode',
      updateId: 'copyCode',
    });
  };

  return (
    <>
      <Flex
        column
        css={{
          width: '100%',
          aspectRatio: '2 / .7',
          borderRadius: 10,
          color: 'white',
          p: '$md',
          background:
            'radial-gradient(circle at 25% 0%, #7516BF 30%, #00AEF9 100%)',
          justifyContent: 'space-between',
          // outline: '8px solid rgba(0,0,0,0.4)',
          '@sm': {
            minHeight: '240px',
          },
        }}
      >
        <Flex column style={{ gap: 5 }}>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            Who is{skill === 'based' ? '' : ' great at'}
          </Text>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            <PartyDisplayText text={`#${displayedText}`} />
          </Text>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            on Farcaster
          </Text>
        </Flex>
        <Flex
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <Flex
            css={{
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              css={{
                fontSize: 38,
                '@sm': {
                  fontSize: 32,
                },
              }}
            >
              give.party
            </Text>
            <GemCoOutline size="2xl" fa />
          </Flex>
        </Flex>
      </Flex>
      <Flex column css={{ mt: '$lg', gap: '$md', width: '100%' }}>
        <Text h1 as="label">
          Start Your Own GIVE Party!
        </Text>
        <TextField
          css={{
            width: '100%',
            background: 'rgba(0,0,0,0.6)',
            outline: errors
              ? '8px solid rgb(255 0 155 / 34%)'
              : '8px solid rgba(0,0,0,0.2)',
            padding: '$sm $md',
            fontSize: '$large',
            border: 'none',
            // fontWeight: '$semibold',
          }}
          value={skill}
          placeholder={'Enter a skill to celebrate'}
          onChange={e => validate(e.target.value)}
        ></TextField>
        {errors && (
          <Text
            tag
            css={{
              background: 'rgb(255 0 155 / 34%)',
              padding: '$sm',
            }}
          >
            {errors}
          </Text>
        )}
      </Flex>
      {skill && !errors && (
        <>
          <Link href={startPartyUrl} target="_blank" css={{ width: '100%' }}>
            <Flex
              css={{
                background:
                  'radial-gradient(circle at 15% 0%, #031c5d 20%, #6e00c3 100%)',
                padding: '10px 15px',
                borderRadius: 10,
                width: '100%',
                // outline: '8px solid rgba(0,0,0,0.2)',
                position: 'relative',
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
                  fontSize: 32,
                  '@md': {
                    fontSize: 32,
                    fontWeight: '$semibold',
                  },
                  '@tablet': {
                    fontSize: 32,
                    fontWeight: '$semibold',
                  },
                  '@sm': {
                    fontSize: 15,
                    fontWeight: '$semibold',
                  },
                }}
              >
                <span>https://give.party/</span>
                <PartyDisplayText
                  text={skill ? skill : 'a-skill-to-celebrate'}
                />
              </Text>
            </Flex>
          </Link>
        </>
      )}
      <Flex css={{ mt: '-$sm', gap: '$md' }}>
        <Button
          as={Link}
          href={startPartyUrl}
          target="_blank"
          rel="noreferrer"
          css={{
            ...((!skill || errors) && {
              ...disabledStyle,
            }),
          }}
        >
          <Wand fa size={'md'} /> Cast in Farcaster
        </Button>
        <Button disabled={skill && !errors ? false : true} onClick={copyToClip}>
          <Copy size={'md'} /> Copy URL
        </Button>
      </Flex>
    </>
  );
};

const StartSurpriseParty = () => {
  const words = ['zemm', 'ashmbanks', 'ted'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<string | undefined>(undefined);

  const startPartyUrl = `https://warpcast.com/~/compose?text=https://give.party/surprise/${username}&embeds[]=https://give.party/surprise/${username}`;

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (charIndex < currentWord.length) {
      const timer = setTimeout(() => {
        setDisplayedText(displayedText + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      }, 50); // Adjust speed of typing here
      return () => clearTimeout(timer);
    } else {
      const nextWordTimer = setTimeout(() => {
        setWordIndex((wordIndex + 1) % words.length);
        setDisplayedText('');
        setCharIndex(0);
      }, 2000); // Adjust pause between words here
      return () => clearTimeout(nextWordTimer);
    }
  }, [charIndex, displayedText, wordIndex, words]);

  const validate = (value: string) => {
    const result = usernameSchema.safeParse(value);
    if (!result.success) {
      setErrors(result.error.issues[0].message);
    } else {
      setErrors(undefined);
    }
    setUsername(value);
  };

  const { showDefault } = useToast();

  const copyToClip = () => {
    copy(`https://give.party/surprise/${username}`);
    showDefault(`Copied URL to clipboard`, {
      toastId: 'copyCode',
      updateId: 'copyCode',
    });
  };

  return (
    <>
      <Flex
        column
        css={{
          width: '100%',
          aspectRatio: '2 / .7',
          borderRadius: 10,
          p: '$md',
          color: 'white',
          background:
            'radial-gradient(circle at 25% 0%,        #00AEF9 20%, #7516BF 60%)',
          justifyContent: 'space-between',
          // outline: '8px solid rgba(0,0,0,1.0)',
          '@sm': {
            minHeight: '240px',
          },
        }}
      >
        <Flex column style={{ gap: 5 }}>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            {`It's a GIVE Party for`}
          </Text>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            <PartyDisplayText text={`@${displayedText}`} />
          </Text>
          <Text
            semibold
            css={{
              fontSize: 36,
              '@sm': {
                fontSize: 30,
              },
            }}
          >
            send them GIVE for the skills you appreciate!
          </Text>
        </Flex>
        <Flex
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <Flex
            css={{
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Text
              css={{
                fontSize: 38,
                '@sm': {
                  fontSize: 32,
                },
              }}
            >
              give.party
            </Text>
            <GemCoOutline size="2xl" fa />
          </Flex>
        </Flex>
      </Flex>
      <Flex column css={{ mt: '$lg', gap: '$md', width: '100%' }}>
        <Text h1 as="label">
          Start your own GIVE party for a Friend!
        </Text>
        <TextField
          css={{
            width: '100%',
            background: 'rgba(0,0,0,0.6)',
            outline: errors
              ? '8px solid rgb(255 0 155 / 34%)'
              : '8px solid rgba(0,0,0,0.2)',
            padding: '$sm $md',
            fontSize: '$large',
            border: 'none',
            // fontWeight: '$semibold',
          }}
          value={username}
          placeholder={'Enter a Farcaster username to celebrate'}
          onChange={e => validate(e.target.value)}
        ></TextField>
        {errors && (
          <Text
            tag
            css={{
              background: 'rgb(255 0 155 / 34%)',
              padding: '$sm',
            }}
          >
            {errors}
          </Text>
        )}
      </Flex>
      {username && !errors && (
        <>
          <Link href={startPartyUrl} target="_blank" css={{ width: '100%' }}>
            <Flex
              css={{
                background:
                  'radial-gradient(circle at 15% 0%, #031c5d 20%, #6e00c3 100%)',
                padding: '10px 15px',
                borderRadius: 10,
                width: '100%',
                // outline: '8px solid rgba(0,0,0,0.2)',
                position: 'relative',
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
                  fontSize: 32,
                  '@md': {
                    fontSize: 32,
                    fontWeight: '$semibold',
                  },
                  '@tablet': {
                    fontSize: 32,
                    fontWeight: '$semibold',
                  },
                  '@sm': {
                    fontSize: 15,
                    fontWeight: '$semibold',
                  },
                }}
              >
                <span>https://give.party/surprise/</span>
                <PartyDisplayText
                  text={username ? username : 'someone-to-celebrate'}
                />
              </Text>
            </Flex>
          </Link>
        </>
      )}
      <Flex css={{ mt: '-$sm', gap: '$md' }}>
        <Button
          as={Link}
          href={startPartyUrl}
          target="_blank"
          rel="noreferrer"
          css={{
            ...((!username || errors) && {
              ...disabledStyle,
            }),
          }}
        >
          <Wand fa size={'md'} /> Cast in Farcaster
        </Button>
        <Button
          disabled={username && !errors ? false : true}
          onClick={copyToClip}
        >
          <Copy size={'md'} /> Copy URL
        </Button>
      </Flex>
    </>
  );
};
