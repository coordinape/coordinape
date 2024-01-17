// __mocks__/react-markdown.tsx
import React from 'react';

export const MarkdownPreview = ({
  children,
}: {
  children?: React.ReactNode;
}) => <div>{children}</div>;
