import { useAuth } from '../providers/auth';
import LinksList from './links-list';
import { AUTH_CHECK_STATUS } from '../utils/constants';

export default function EntryPoint() {
  const { status } = useAuth();

  if (status === AUTH_CHECK_STATUS.UNKNOWN) {
    return (
      <div className="app">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <LinksList/>
    </div>
  );
}
