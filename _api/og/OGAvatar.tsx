import React from 'react';

const DEFAULT_AVATAR =
  'https://coordinape-prod.s3.amazonaws.com/default_profile.jpg';

export const OGAvatar = ({ avatar }: { avatar?: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
      }}
    >
      <img
        alt="avatar"
        height={95}
        width={95}
        src={
          avatar
            ? (avatar.startsWith('http') ? '' : process.env.VITE_S3_BASE_URL) +
              avatar
            : DEFAULT_AVATAR
        }
        style={{ margin: 0, borderRadius: 99999 }}
      />
    </div>
  );
};
