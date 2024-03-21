import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { AUTH_CHECK_STATUS } from '../utils/constants';
import { useAuth } from '../providers/auth';
import SetupScreen from './setup-screen';
import LinksList from './links-list';

export default function EntryPoint() {
  const { status } = useAuth();

  if (status === AUTH_CHECK_STATUS.UNKNOWN) {
    return (
      <div className="app">
        <Heading>Loading...</Heading>
      </div>
    );
  }

  if (status === AUTH_CHECK_STATUS.FAILED) {
    return (
      <div className="app">
        <div className="fail-screen">
          <Heading>Error</Heading>
          <Text type={Text.types.TEXT1}>
            An error occurred while trying to authenticate you.
            Please try again later.
          </Text>
        </div>
      </div>
    );

  }

  if (status === AUTH_CHECK_STATUS.NEEDS_SETUP) {
    return <SetupScreen/>;
  }

  return (
    <div className="app">
      <LinksList/>
    </div>
  );
}
