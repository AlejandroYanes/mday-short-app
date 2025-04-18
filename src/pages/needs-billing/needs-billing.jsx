import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Flex, Text, Toggle } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { BILLING_CYCLE, PLANS } from '../../utils/constants';
import { monday } from '../../utils/monday';
import { billingAPI } from '../../api/billling';
import { handleInitialisation, useAuth } from '../../providers/auth';
import { Logo } from '../../components/logo';
import './styles.css';

const Container = (props) => (
  <div data-el="plan-card" className="billing_cards__container">
    {props.children}
  </div>
);

const Header = ({ highlight, children }) => (
  <Heading element="h2" data-active={highlight} className="billing_cards__header">
    {children}
  </Heading>
);

const Price = (props) => (
  <Text type={Text.types.TEXT1} element="p" data-active={props.highlight} className="billing_cards__price">
    <span className="billing_cards__price__value">
      ${props.value}
    </span>
    <span>/{props.cycle}</span>
  </Text>
);

export default function NeedsBillingScreen() {
  const { workspace, email, token } = useAuth();

  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLE.MONTH);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState(false);

  // TODO: should add error handling at some point
  const { data, error: fetchError } = useQuery({
    queryKey: ['billing', { workspace, token }],
    queryFn: () => billingAPI.check({ workspace, token }),
  });

  useEffect(() => {
    if (data && data.hasSubscription) {
      handleInitialisation();
    }
  }, [data]);

  useEffect(() => {
    if (fetchError) {
      monday.execute('notice', {
        type: 'error',
        timeout: 2500,
        message: 'An error occurred while checking the billing status. Please try again later or contact support.',
      });
    }
  }, [fetchError]);

  const handleBillingCycleChange = (selected) => {
    setBillingCycle(selected ? BILLING_CYCLE.YEAR : BILLING_CYCLE.MONTH);
  };

  const getCheckoutURL = async (plan) => {
    setProcessingPlan(plan);
    setError(false);

    try {
      const response = await billingAPI.getCheckoutURL({ workspace, email, plan, cycle: billingCycle, token });

      if (response.ok) {
        const data = await response.json();
        window.open(data.url, '_blank', 'noopener noreferrer');
        setProcessingPlan(null);
      } else {
        setError(true);
        setProcessingPlan(null);
      }
    } catch (e) {
      setError(true);
      setProcessingPlan(null);
    }
  };

  return (
    <div className="app">
      <div className="message-screen">
        <Logo width={120} height={120}/>
        <Heading align={Heading.align.CENTER}>Next step is billing</Heading>

        <div className="billing_cards__wrapper">
          <Toggle
            offOverrideText="Monthly"
            onOverrideText="Yearly"
            isSelected={billingCycle !== BILLING_CYCLE.MONTH}
            onChange={handleBillingCycleChange}
          />

          <div className="billing_cards">
            <Container>
              <Header>Base Plan</Header>
              <Price value={billingCycle === 'month' ? 8 : 80} cycle={billingCycle}/>
              <Text type={Text.types.TEXT1} className="billing_cards__features__container">
                <ul className="billing_cards__features">
                  <li>Create as many links as you want to</li>
                  <li>90 days of analytics (coming soon)</li>
                </ul>
              </Text>
              <Flex direction={Flex.directions.COLUMN} align={Flex.align.STRETCH} gap={Flex.gaps.MEDIUM}>
                <Button
                  kind={Button.kinds.SECONDARY}
                  disabled={!!processingPlan && processingPlan !== PLANS.BASIC}
                  loading={processingPlan === PLANS.BASIC}
                  onClick={() => getCheckoutURL(PLANS.BASIC)}
                >
                Get Started
                </Button>
                <Text type={Text.types.TEXT2} align={Text.align.CENTER} element="p">
                With a 14 days free trial.
                </Text>
              </Flex>
            </Container>

            <div className="billing_cards__divider"/>

            <Container>
              <Header highlight>Premium Plan</Header>
              <Price value={billingCycle === 'month' ? 12 : 120} cycle={billingCycle} highlight/>
              <Text type={Text.types.TEXT1} className="billing_cards__features__container">
                <ul className="billing_cards__features">
                  <li>Create as many links as you want to</li>
                  <li>365 days of analytics (coming soon)</li>
                  <li>Use custom domains</li>
                  <li>Generate QR codes to share (coming soon)</li>
                </ul>
              </Text>
              <Text type={Text.types.TEXT1} element="p">
                We are offering discounts for the first 100 users.
              </Text>
              <Flex direction={Flex.directions.COLUMN} align={Flex.align.STRETCH} gap={Flex.gaps.MEDIUM}>
                <Button
                  kind={Button.kinds.PRIMARY}
                  disabled={!!processingPlan && processingPlan !== PLANS.PREMIUM}
                  loading={processingPlan === PLANS.PREMIUM}
                  onClick={() => getCheckoutURL(PLANS.PREMIUM)}
                >
                  Get Started
                </Button>
                <Text type={Text.types.TEXT2} align={Text.align.CENTER} element="p">
                  With a 14 days free trial.
                </Text>
              </Flex>
            </Container>
          </div>
        </div>

        <Text element="p" type={Text.types.TEXT1} align={Text.align.CENTER} style={{ marginBottom: '16px' }}>
          If the user setting up the billing is not an owner, one will be picked from the workspace.
        </Text>

        {error ? (
          <Text
            element="p"
            type={Text.types.TEXT2}
            align={Text.align.CENTER}
            style={{ color: 'var(--negative-color)', maxWidth: '360px' }}
          >
            An error occurred while trying to get the checkout.
            <br/>
            Please try again later. If the issue persists, contact support at{' '}
            <a
              href="mailto:contact@mndy.link"
              style={{color: 'var(--negative-color)', font: 'var(--font-text2-normal)'}}
            >
              contact@mndy.link
            </a>
          </Text>
        ) : null}
      </div>
    </div>
  );
}
