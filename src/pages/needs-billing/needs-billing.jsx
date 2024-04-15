import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Text, Toggle } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';

import { BILLING_CYCLE, PLANS } from '../../utils/constants';
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
      £{props.value}
    </span>
    <span>/{props.cycle}</span>
  </Text>
);

export default function NeedsBillingScreen() {
  const { workspace, email, token } = useAuth();

  // TODO: should add error handling at some point
  const { data } = useQuery({
    queryKey: ['billing', { workspace, token }],
    queryFn: () => billingAPI.check({ workspace, token }),
  });

  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLE.MONTH);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data && data.hasSubscription) {
      handleInitialisation();
    }
  }, [data]);

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
                  <li>Create as many links as you want to.</li>
                  <li>Access to Analytics</li>
                </ul>
              </Text>
              <Button
                kind={Button.kinds.SECONDARY}
                disabled={!!processingPlan && processingPlan !== PLANS.BASIC}
                loading={processingPlan === PLANS.BASIC}
                onClick={() => getCheckoutURL(PLANS.BASIC)}
              >
                Buy Plan
              </Button>
            </Container>

            <div className="billing_cards__divider"/>

            <Container>
              <Header highlight>Premium Plan</Header>
              <Price value={billingCycle === 'month' ? 12 : 120} cycle={billingCycle} highlight/>
              <Text type={Text.types.TEXT1} className="billing_cards__features__container">
                <ul className="billing_cards__features">
                  <li>Sames as the Base Plan.</li>
                  <li>Use custom domains.</li>
                  <li>Generate QR codes to share.</li>
                </ul>
              </Text>
              <Text type={Text.types.TEXT1} element="p">
                We are offering discounts for the first 100 users.
              </Text>
              <Button
                kind={Button.kinds.PRIMARY}
                disabled={!!processingPlan && processingPlan !== PLANS.PREMIUM}
                loading={processingPlan === PLANS.PREMIUM}
                onClick={() => getCheckoutURL(PLANS.PREMIUM)}
              >
                Buy Plan
              </Button>
            </Container>
          </div>
        </div>

        <Text element="p" type={Text.types.TEXT1} align={Text.align.CENTER} style={{ marginBottom: '16px' }}>
          We advice for the billing to be set up by a workspace owner.
          <br/>
          Not doing so will not affect the {`app's`} functionality {' '}
          but only owners will have access to the billing settings.
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
