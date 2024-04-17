import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { Logo } from './logo';

const defaultMessage = (
  <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
    An error occurred while trying to authenticate you.
    <br/>
    Please try again later. If the issue persists, contact support at{' '}
    <a
      href="mailto:contact@mndy.link"
      style={{color: 'var(--negative-color)', font: 'var(--font-text2-normal)'}}
    >
      contact@mndy.link
    </a>
  </Text>
);

export default function ErrorScreen({ title, children }) {
  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120}/>
        <Heading align={Heading.align.CENTER}>{title ?? 'Oops...'}</Heading>
        {children ?? defaultMessage}
      </div>
    </div>
  );
}
