import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    width: '224px',
    color: '#5E6F74',
    fontSize: '14px',
    fontStyle: 'normal',
    lineHeight: '20px',
    letterSpacing: '0em',
    textAlign: 'left',
  },

  contentType: {
    textTransform: 'capitalize',
    fontSize: '16px',
  },

  link: {
    textAlign: 'center',
    color: '#00ABBF',
  },
}));
export const ApeInfoTooltipContentForToggle = ({
  yesContent,
  noContent,
  documentLink,
}: {
  yesContent: string;
  noContent: string;
  documentLink?: string;
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ContentSection type="yes" content={yesContent} />
      <ContentSection type="no" content={noContent} />
      {documentLink && (
        <div style={{ textAlign: 'center' }}>
          <Link
            className={classes.link}
            to={{ pathname: documentLink }}
            target="_blank"
          >
            See the document...
          </Link>
        </div>
      )}
    </div>
  );
};

const ContentSection = ({
  content,
  type,
}: {
  content: string;
  type: 'yes' | 'no';
}) => {
  const classes = useStyles();
  return (
    <p>
      <span className={classes.contentType}> {`${type} - `}</span> {content}
    </p>
  );
};
