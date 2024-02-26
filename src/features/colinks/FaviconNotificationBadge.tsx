import { useEffect } from 'react';

import { webAppURL } from '../../config/webAppURL';
import { useNotificationCount } from '../notifications/useNotificationCount';

export const FaviconNotificationBadge = () => {
  const { count: notificationCount } = useNotificationCount();
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (notificationCount !== undefined && notificationCount > 0) {
      link.href = webAppURL('colinks') + '/imgs/logo/colinks-favicon-noti.png';
    } else {
      link.href = webAppURL('colinks') + '/imgs/logo/colinks-favicon.png';
    }
  }, [notificationCount]);

  return null;
};
