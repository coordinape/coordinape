import { makeStyles } from '@material-ui/core';

import { FormFileUpload } from 'components/index';
import { useImageUploader } from 'hooks';
import { Avatar } from 'ui';
import { getAvatarPath } from 'utils/domain';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
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
      <Avatar path={imageUrl} size="large" />
      <FormFileUpload
        className={classes.buttons}
        commit={commit}
        {...formFileUploadProps}
        accept="image/gif, image/jpeg, image/png"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};
