import { Frame } from '../../_api/frames/router.tsx';
import { webAppURL } from '../../src/config/webAppURL';

import { FramePostInfo } from './_getFramePostInfo.tsx';

export const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;

export const TRY_GIVEBOT_INTENT =
  'https://warpcast.com/~/compose?text=@givebot @receiverName %23skillTag';

export const getPostUrl = (frame: Frame, params: Record<string, string>) => {
  return `${FRAME_ROUTER_URL_BASE}/post/${frame.id}${resourcePath(frame, params)}`;
};

export const getImgSrc = (
  frame: Frame,
  params: Record<string, string>,
  info?: FramePostInfo
) => {
  const viewer_profile_id: string | undefined = info?.profile?.id;
  const error_message: string | undefined = params['error_message'];

  const imgParams = {
    //ts: DateTime.now().valueOf().toString(),
    ...(error_message && { error_message: error_message }),
    ...(viewer_profile_id && { viewer_profile_id: viewer_profile_id }),
  };

  return `${FRAME_ROUTER_URL_BASE}/img/${frame.id}${resourcePath(frame, params)}?${new URLSearchParams(imgParams).toString()}`;
};

const resourcePath = (frame: Frame, params: Record<string, string>) => {
  const resourceId = frame.resourceIdentifier.getResourceId(params);
  return resourceId ? `${resourceId}` : '';
};
