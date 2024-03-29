import { Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { APP_STATUS } from '../utils/constants';
import { useAuth } from '../providers/auth';
import SetupScreen from '../pages/setup';
import InvitationScreen from '../pages/invitation';
import MainView from './main-view';
import { Logo } from './logo';

export default function EntryPoint() {
  const { status } = useAuth();

  switch (status) {
    case APP_STATUS.UNKNOWN:
      return (
        <div className="app">
          <div className="message-screen">
            <Logo width={120} height={120}/>
            <Heading align={Heading.align.CENTER}>Loading...</Heading>
          </div>
        </div>
      );
    case APP_STATUS.PENDING:
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
    case APP_STATUS.INACTIVE:
      return (
        <div className="app">
          <div className="message-screen">
            <Logo width={120} height={120} />
            <Heading align={Heading.align.CENTER}>Hi there</Heading>
            <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
              Your account is inactive.
              <br/>
              Please contact a workspace owner to activate your account.
            </Text>
          </div>
        </div>
      );
    case APP_STATUS.VIEW_ONLY:
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
    case APP_STATUS.INVITED:
      return <InvitationScreen />;
    case APP_STATUS.NEEDS_SETUP:
      return <SetupScreen/>;
    case APP_STATUS.AUTHENTICATED:
      return <MainView/>;
    default:
      return (
        <div className="app">
          <div className="message-screen">
            <Heading align={Heading.align.CENTER}>Error</Heading>
            <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
              An error occurred while trying to authenticate you.
              <br/>
              Please try again later.
            </Text>
          </div>
        </div>
      );
  }
}
