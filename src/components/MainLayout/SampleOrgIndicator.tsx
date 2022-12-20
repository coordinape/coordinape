import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Flex, Text } from '../../ui';

export const SampleOrgIndicator = () => (
  <Flex
    css={{
      backgroundColor: '$tagActiveBackground',
      py: '$md',
      justifyContent: 'center',
    }}
  >
    <Flex css={{ flex: 1, marginRight: 'auto', '@sm': { display: 'none' } }}>
      &nbsp;
    </Flex>
    <Text
      semibold
      color="active"
      css={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        '@sm': {
          fontSize: '$small',
          justifyContent: 'flex-start',
          pl: '$md',
        },
      }}
    >
      Sample Organization
    </Text>
    <Flex
      css={{
        flex: 1,
        marginLeft: 'auto',
        justifyContent: 'flex-end',
        pr: '$md',
      }}
    >
      <NavLink to={paths.createCircle} style={{ textDecoration: 'none' }}>
        <Flex
          css={{
            flexDirection: 'column',
            justifyItems: 'center',
          }}
        >
          <Text
            css={{
              color: '$tagActiveText',
              textDecoration: 'none',
              mb: '$xs',
              justifyContent: 'center',
            }}
            size="small"
          >
            Done Testing?
          </Text>
          <Text
            css={{
              textDecoration: 'underline',
              color: '$tagActiveText',
            }}
            semibold
            size="small"
          >
            Create a Circle
          </Text>
        </Flex>
      </NavLink>
    </Flex>
  </Flex>
);
