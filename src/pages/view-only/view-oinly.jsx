import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { Logo } from '../../components/logo';

export default function ViewOnlyScreen() {
  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120} />
        <Heading align={Heading.align.CENTER}>Hi there</Heading>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
          As a viewer, you are unable to use this app.
          <br/>
          Please contact a workspace owner for more information.
        </Text>
      </div>
    </div>
  );
}
