import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { Logo } from '../../components/logo';

export default function PendingScreen() {
  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120} />
        <Heading align={Heading.align.CENTER}>Hi there</Heading>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
          Your account is pending approval.
          <br/>
          Please wait for a workspace owner to approve your request.
        </Text>
      </div>
    </div>
  );
}
