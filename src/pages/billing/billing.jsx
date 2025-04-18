import { Button, Flex, Text, Skeleton, MenuButton, Menu, MenuItem } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { useMutation, useQuery } from '@tanstack/react-query';

import { formatDate } from '../../utils/dates';
import { monday } from '../../utils/monday';
import { queryClient } from '../../utils/query';
import { billingAPI } from '../../api/billling';
import ErrorScreen from '../../components/error-screen';
import InvoicesTable from './invoices-table';
import { SUBSCRIPTION_ACTIONS, SUBSCRIPTION_ENDPOINTS } from './constants';
import './styles.css';
import { resolveStatusLabel } from './helpers';
import RenderIf from '../../components/render-if';

export default function BillingPage() {
  const { data: billingInfo, isLoading, isError } = useQuery({
    queryKey: ['billing'],
    queryFn: billingAPI.getDetails,
    refetchOnWindowFocus: 'always',
    refetchInterval: 1000 * 60 * 60,
  });

  const { mutateAsync: updateSubscription, isPending: isUpdating } = useMutation({
    mutationFn: async (action) => {
      const response = await SUBSCRIPTION_ENDPOINTS[action]();

      if (response.ok) {
        monday.execute('notice', {
          type: 'success',
          message: 'Subscription updated successfully',
        });
        queryClient.invalidateQueries({
          queryKey: ['billing'],
        });
        queryClient.invalidateQueries({
          queryKey: ['billing', 'invoices'],
        });
      } else {
        monday.execute('notice', {
          type: 'error',
          message: 'Something went wrong while updating the subscription. Please try again later or contact support',
        });
      }
    },
  });

  const { mutateAsync: updatePaymentMethod, isPending: isFetchingPaymentLink, isError: failedToFetchPaymentLink } = useMutation({
    mutationFn: async () => {
      const response = await billingAPI.getLinkToUpdatePaymentMethod();

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Failed to open the customer portal');
      }
    },
  });

  if (isLoading) {
    return (
      <div className="billing__page">
        <div className="billing__grid">
          <div className="billing__card">
            <Flex direction="row" align={Flex.align.CENTER} justify={Flex.justify.START}>
              <Heading type="h3" weight={Text.weights.BOLD}>Current Plan</Heading>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2}>Current Plan</Text>
              <Skeleton width="220px" height="16px"/>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2}>Next billing date</Text>
              <Skeleton width="220px" height="16px"/>
            </Flex>
          </div>

          <div className="billing__card">
            <Flex direction="row" align={Flex.align.CENTER} justify={Flex.justify.START}>
              <Heading type="h3" weight={Text.weights.BOLD}>Billing Information</Heading>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2}>Card Information</Text>
              <Skeleton width="220px" height="16px"/>
            </Flex>

            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
              <Text type={Text.types.TEXT2}>Billed to</Text>
              <Skeleton width="220px" height="16px"/>
            </Flex>
          </div>
        </div>

        <InvoicesTable/>
      </div>
    );
  }

  if (isError || !billingInfo) {
    return (
      <ErrorScreen title="Oops..." centered={false}>
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
      <div className="billing__grid">
        <div className="billing__card">
          <Flex direction="row" align={Flex.align.CENTER} justify={Flex.justify.SPACE_BETWEEN}>
            <Heading type="h3" weight={Text.weights.BOLD}>Current Plan</Heading>
            <MenuButton dialogPosition="bottom-end" disabled={isFetchingPaymentLink}>
              <Menu>
                {['cancelled', 'paused'].indexOf(billingInfo.status) === -1 ? (
                  <MenuItem title="Pause Subscription" onClick={() => updateSubscription(SUBSCRIPTION_ACTIONS.PAUSE)} />
                ) : null}
                {billingInfo.status === 'paused' ? (
                  <MenuItem title="Unpause Subscription" onClick={() => updateSubscription(SUBSCRIPTION_ACTIONS.UNPAUSE)} />
                ) : null}
                {billingInfo.status === 'cancelled' ? (
                  <MenuItem title="Resume Subscription" onClick={() => updateSubscription(SUBSCRIPTION_ACTIONS.RESUME)} />
                ) : null}
                {billingInfo.status !== 'cancelled' ? (
                  <MenuItem title="Cancel Subscription" onClick={() => updateSubscription(SUBSCRIPTION_ACTIONS.CANCEL)} />
                ) : null}
              </Menu>
            </MenuButton>
          </Flex>

          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Current Plan</Text>
            <Flex justify={Flex.justify.START} gap={Flex.gaps.SMALL}>
              <Text type={Text.types.TEXT1}>{billingInfo.plan}</Text>
              <Text type={Text.types.TEXT1}>
                ${billingInfo.price / 100} /{billingInfo.cycle}{resolveStatusLabel(billingInfo.status)}
              </Text>
            </Flex>
          </Flex>

          <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
            <Text type={Text.types.TEXT2}>Next billing date</Text>
            <Text type={Text.types.TEXT1}>{formatDate(billingInfo.renewsAt)}</Text>
          </Flex>
        </div>

        <div className="billing__card">
          <Flex direction="row" align={Flex.align.CENTER} justify={Flex.justify.SPACE_BETWEEN}>
            <Heading type="h3" weight={Text.weights.BOLD}>Billing Information</Heading>
            <Button
              kind={Button.kinds.SECONDARY}
              loading={isFetchingPaymentLink}
              disabled={isUpdating}
              onClick={updatePaymentMethod}
            >
              Update
            </Button>
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

          {failedToFetchPaymentLink ? (
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
        </div>
      </div>

      <InvoicesTable/>
    </div>
  );
}
