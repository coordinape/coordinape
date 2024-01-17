// __mocks__/react-markdown.tsx
import React from 'react';

const ReactMarkdownMock = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);

export default ReactMarkdownMock;
