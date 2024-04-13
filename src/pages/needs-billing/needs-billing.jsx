import { useState } from 'react';
import { Button, Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { billingAPI } from '../../api/billling';
import { BASE_URL } from '../../utils/constants';
import { useAuth } from '../../providers/auth';
import { Logo } from '../../components/logo';

export default function NeedsBillingScreen() {
  const { workspace, email, token } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const getCheckoutToken = async () => {
    setIsProcessing(true);
    setError(false);

    try {
      const response = await billingAPI.getCheckoutToken({ workspace, email, token });

      if (response.ok) {
        const data = await response.json();
        const url = `${BASE_URL}/pricing?token=${data.token}`;
        window.open(url, '_blank', 'noopener noreferrer');
        setIsProcessing(false);
      } else {
        setError(true);
        setIsProcessing(false);
      }
    } catch (e) {
      setError(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120} />
        <Heading align={Heading.align.CENTER}>Next step is billing</Heading>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER} element="p">
          {`We'll`} take you to our billing page to complete the setup.
          <br />
          After that, you can start using the app.
        </Text>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER} element="p" style={{ marginBottom: '16px' }}>
          We advice for the billing to be set up by a workspace owner.
          <br />
          This will not affect the {`app's`} functionality {' '}
          but only owners will have access to the billing settings.
        </Text>

        {error ? (
          <Text
            type={Text.types.TEXT2}
            align={Text.align.CENTER}
            element="p"
            style={{ color: 'var(--negative-color)', maxWidth: '360px' }}
          >
            An error occurred while trying to get the checkout token.
            <br />
            Please try again later. If the issue persists, contact support at{' '}
            <a href="mailto:contact@mndy.link" style={{ color: 'var(--negative-color)', font: 'var(--font-text2-normal)' }}>
              contact@mndy.link
            </a>
          </Text>
        ) : null}

        <Button loading={isProcessing} onClick={getCheckoutToken}>
          Check our plans
        </Button>
      </div>
    </div>
  );
}
