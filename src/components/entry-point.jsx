// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { APP_STATUS } from '../utils/constants';
import { useAuth } from '../providers/auth';
import SetupScreen from '../pages/setup';
import InvitationScreen from '../pages/invitation';
import PendingScreen from '../pages/pending/pending';
import InactiveScreen from '../pages/inactive';
import ViewOnlyScreen from '../pages/view-only';
import NeedsBillingScreen from '../pages/needs-billing';
import MainView from './main-view';
import { Logo } from './logo';
import ErrorScreen from './error-screen';

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
      return <PendingScreen />;
    case APP_STATUS.INACTIVE:
      return <InactiveScreen />
    case APP_STATUS.VIEW_ONLY:
      return <ViewOnlyScreen />
    case APP_STATUS.INVITED:
      return <InvitationScreen />;
    case APP_STATUS.NEEDS_SETUP:
      return <SetupScreen/>;
    case APP_STATUS.NEEDS_BILLING:
      return <NeedsBillingScreen />;
    case APP_STATUS.AUTHENTICATED:
      return <MainView/>;
    default:
      return <ErrorScreen />;
  }
}
