import isFeatureEnabled from 'config/features';
import { Link, Text } from 'ui';

import { EmailModal } from './EmailModal';

export const EmailBanner = () => {
  return (
    <>
      {isFeatureEnabled('email') && (
        <Text tag color="warning" css={{ borderRadius: 0, p: '$sm' }}>
          <EmailModal>
            <Link inlineLink>Manage Email Settings</Link>
          </EmailModal>
        </Text>
      )}
    </>
  );
};
