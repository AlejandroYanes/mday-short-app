import { useState } from 'react';
import { Button, Flex, Text, Skeleton } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '../../utils/dates';
import { billingAPI } from '../../api/billling';
import ErrorScreen from '../../components/error-screen';
import './styles.css';
import InvoicesTable from './invoices-table';

export default function BillingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const { data: billingInfo, isLoading, isError } = useQuery({
    queryKey: ['billing'],
    queryFn: billingAPI.getDetails,
    refetchInterval: 1000 * 60 * 60,
  });

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

  if (isLoading) {
    return (
      <div className="billing__page">
        <div className="billing__card">
          <Heading type="h3" weight={Text.weights.BOLD}>Billing Information</Heading>

          <div className="billing__card__grid">
            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2}>Current Plan</Text>
              <Flex justify={Flex.justify.START} gap={Flex.gaps.SMALL}>
                <Skeleton width="220px" height="16px"/>
              </Flex>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} gap={Flex.gaps.XS}>
              <Text type={Text.types.TEXT2}>Next billing date</Text>
              <Skeleton width="150px" height="16px"/>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} gap={Flex.gaps.XS}>
              <Text type={Text.types.TEXT2}>Card Information</Text>
              <Skeleton width="150px" height="16px"/>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} gap={Flex.gaps.XS}>
              <Text type={Text.types.TEXT2}>Billed to</Text>
              <Skeleton width="150px" height="16px"/>
            </Flex>
          </div>

          <div style={{height: 40}}/>
        </div>
      </div>
    );
  }

  if (isError || !billingInfo) {
    return (
      <ErrorScreen title="Oops...">
        <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
          An error occurred while trying to get the billing information.
          <br/>
          Please try again later. If the issue persists, contact support at{' '}
          <a
            href="mailto:contact@mndy.link"
            style={{color: 'var(--negative-color)', font: 'var(--font-text2-normal)'}}
          >
            contact@mndy.link
          </a>
        </Text>
      </ErrorScreen>
    );
  }

  return (
    <div className="billing__page">
      <div className="billing__card">
        <Heading type="h3" weight={Text.weights.BOLD}>Billing Information</Heading>

        <div className="billing__card__grid">
          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Current Plan</Text>
            <Flex justify={Flex.justify.START} gap={Flex.gaps.SMALL}>
              <Text type={Text.types.TEXT1}>Basic Plan</Text>
              <Text type={Text.types.TEXT1}>${billingInfo.price / 100} /month</Text>
            </Flex>
          </Flex>

          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Next billing date</Text>
            <Text type={Text.types.TEXT1}>{formatDate(billingInfo.renewsAt)}</Text>
          </Flex>

          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Card Information</Text>
            <Text type={Text.types.TEXT1}>
              <span className="capitalize" style={{marginRight: '4px'}}>{billingInfo.cardBrand}</span>
              <span>{`ending in ${billingInfo.cardDigits}`}</span>
            </Text>
          </Flex>

          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Billed to</Text>
            <Text type={Text.types.TEXT1}>{billingInfo.customerName} - {billingInfo.customerEmail}</Text>
          </Flex>
        </div>

        <Flex direction={Flex.directions.COLUMN} justify={Flex.justify.START} align={Flex.align.START}>
          {error ? (
            <Text
              type={Text.types.TEXT2}
              element="p"
              style={{color: 'var(--negative-color)'}}
            >
              An error occurred while trying to open the customer portal.
              Please try again later. If the issue persists, contact support at{' '}
              <a
                href="mailto:contact@mndy.link"
                style={{color: 'var(--negative-color)', font: 'var(--font-text2-normal)'}}
              >
                contact@mndy.link
              </a>
            </Text>
          ) : null}
          <Button kind={Button.kinds.PRIMARY} loading={isProcessing} onClick={openCustomerPortal}>
            Update
          </Button>
        </Flex>
      </div>
      <InvoicesTable />
    </div>
  );
}
