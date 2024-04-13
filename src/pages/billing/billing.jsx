import { useState } from 'react';
import { Button, Flex, Text } from 'monday-ui-react-core';

import { billingAPI } from '../../api/billling';
import './styles.css';

export default function BillingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const openCustomerPortal = async () => {
    setIsProcessing(true);
    setError(false);

    try {
      const response = await billingAPI.getCustomerPortal();

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsProcessing(false);
      }
    } catch (error) {
      setError(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="billing__card">
      <Text type={Text.types.TEXT1} weight={Text.weights.BOLD}>Billing Information</Text>

      <div className="billing__card__grid">
        <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
          <Text type={Text.types.TEXT2}>Current Plan</Text>
          <Flex justify={Flex.justify.START} gap={Flex.gaps.SMALL}>
            <Text type={Text.types.TEXT1}>Basic Plan</Text>
            <Text type={Text.types.TEXT1}>£8 /month</Text>
          </Flex>
        </Flex>

        <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
          <Text type={Text.types.TEXT2}>Next billing date</Text>
          <Text type={Text.types.TEXT1}>May 13, 2024</Text>
        </Flex>

        <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
          <Text type={Text.types.TEXT2}>Card Information</Text>
          <Text type={Text.types.TEXT1}>Visa ending in 4242</Text>
        </Flex>

        <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
          <Text type={Text.types.TEXT2}>Billed to</Text>
          <Text type={Text.types.TEXT1}>John Doe - john.doe@domain.com</Text>
        </Flex>
      </div>

      <Flex direction={Flex.directions.COLUMN} justify={Flex.justify.START} align={Flex.align.START}>
        {error ? (
          <Text
            type={Text.types.TEXT2}
            element="p"
            style={{ color: 'var(--negative-color)' }}
          >
            An error occurred while trying to open the customer portal.
            Please try again later. If the issue persists, contact support at{' '}
            <a href="mailto:contact@mndy.link" style={{ color: 'var(--negative-color)', font: 'var(--font-text2-normal)' }}>
              contact@mndy.link
            </a>
          </Text>
        ) : null}
        <Button kind={Button.kinds.PRIMARY} loading={isProcessing} onClick={openCustomerPortal}>
          Update
        </Button>
      </Flex>
    </div>
  );
}
