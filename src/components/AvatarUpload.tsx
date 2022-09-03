import { makeStyles } from '@material-ui/core';

import { ApeAvatar, FormFileUpload } from 'components/index';
import { useImageUploader } from 'hooks';
import { getAvatarPath } from 'utils/domain';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
}));

export const AvatarUpload = ({
  original,
  commit,
}: {
  original?: string;
  commit: (file: File) => Promise<any>;
}) => {
  const classes = useStyles();

  const { imageUrl, formFileUploadProps } = useImageUploader(
    getAvatarPath(original)
  );

  return (
    <div className={classes.root}>
      <ApeAvatar path={imageUrl} className={classes.avatar} />
      <FormFileUpload
        className={classes.buttons}
        commit={commit}
        {...formFileUploadProps}
        accept="image/gif, image/jpeg, image/png"
      />
    </div>
  );
};
