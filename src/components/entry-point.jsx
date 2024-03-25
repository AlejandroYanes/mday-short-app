import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { APP_STATUS } from '../utils/constants';
import { useAuth } from '../providers/auth';
import SetupScreen from '../pages/setup';
import MainView from './main-view';

export default function EntryPoint() {
  const { status } = useAuth();

  switch (status) {
    case APP_STATUS.UNKNOWN:
      return (
        <div className="app">
          <div className="loading-screen">
            <Heading align={Heading.align.CENTER}>Loading...</Heading>
          </div>
        </div>
      );
    case APP_STATUS.PENDING:
      return (
        <div className="app">
          <div className="fail-screen">
            <Heading align={Heading.align.CENTER}>Hi there</Heading>
            <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
              Your account is pending approval.
              Please wait for an admin to approve your request.
            </Text>
          </div>
        </div>
      );
    case APP_STATUS.INVITED:
      return (
        <div className="app">
          <div className="fail-screen">
            <Heading align={Heading.align.CENTER}>Hi there</Heading>
            <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
              You have been invited to join this workspace.
              Please check your email for an invitation link.
            </Text>
          </div>
        </div>
      );
    case APP_STATUS.NEEDS_SETUP:
      return <SetupScreen/>;
    case APP_STATUS.AUTHENTICATED:
      return <MainView/>;
    default:
      return (
        <div className="app">
          <div className="fail-screen">
            <Heading align={Heading.align.CENTER}>Error</Heading>
            <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
              An error occurred while trying to authenticate you.
              Please try again later.
            </Text>
          </div>
        </div>
      );
  }
}
