import { useState } from 'react';
import { Button, Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { usersAPI } from '../../api/users';
import { useAuth } from '../../providers/auth';
import { APP_STATUS } from '../../utils/constants';
import { Logo } from '../../components/logo';

export default function InvitationScreen() {
  const { workspace, email, token, updateStore } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.join({ email, workspace, token });
      setLoading(false);

      if (response.ok) {
        const { role, sessionToken, isPremium } = await response.json();
        updateStore({ status: APP_STATUS.AUTHENTICATED, role, token: sessionToken, isPremium });
      } else {
        throw new Error('failed to accept invitation');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while trying to accept the invitation. Please try again later.');
    }
  };
  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120} />
        <Heading align={Heading.align.CENTER}>Hi there</Heading>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
          You have been invited to join this workspace.
        </Text>
        {error ? (
          <Text
            element="p"
            type={Text.types.TEXT1}
            align={Text.align.CENTER}
            style={{ color: 'var(--negative-color)' }}
          >
            {error}
          </Text>
        ) : null}
        <Button
          kind={Button.kinds.PRIMARY}
          loading={loading}
          onClick={handleAcceptInvitation}
        >
          Accept invitation
        </Button>
      </div>
    </div>
  );
}
