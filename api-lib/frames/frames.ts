import React from 'react';

import { FramePostInfo } from './_getFramePostInfo.tsx';

export const ResourceIdentifierWithParams = (
  ri: ResourceIdentifier,
  preloadParams: Record<string, string>
): ResourceIdentifier => {
  const r: ResourceIdentifier = {
    resourcePathExpression: ri.resourcePathExpression,
    getResourceId: (params: Record<string, string>) => {
      const p = { ...params, ...preloadParams };
      return ri.getResourceId(p);
    },
  };
  return r;
};

export type ResourceIdentifier = {
  resourcePathExpression: string;
  getResourceId: (params: Record<string, string>) => string;
};

export type Frame = {
  buttons: Button[];
  imageNode: (params: Record<string, string>) => Promise<React.JSX.Element>;
  id: string;
  homeFrame: boolean;
  resourceIdentifier: ResourceIdentifier;
  errorMessage?: string;
  inputText?: (params: Record<string, string>) => Promise<string>;
  aspectRatio?: '1:1' | '1.91:1' | undefined;
  clickURL?: string;
  noCache?: boolean;
};

export const isFrame = (o: any): o is Frame => {
  return o && typeof o.id === 'string' && typeof o.imageNode === 'function';
};

export type Button = {
  title: string;
  action: 'post' | 'link';
  // only use target for external links
  target?: string | ((params: Record<string, string>) => string);
  // only use onPost for post
  onPost?: (
    info: FramePostInfo,
    params: Record<string, string>
  ) => Promise<Frame>;
};
