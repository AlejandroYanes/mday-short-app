import { Button, Flex, Text } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { ExternalPage } from 'monday-ui-react-core/icons';
import { useQuery } from '@tanstack/react-query';

import { domainsApi } from '../../api/domains';
import ConfigSection from './config-section';

export default function DomainCard({ domain }) {
  const { data: domainInfo, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['domains', domain],
    queryFn: () => domainsApi.check(domain),

  });
  return (
    <div className="domain_card">
      <Flex align={Flex.align.CENTER} justify={Flex.justify.SPACE_BETWEEN}>
        <a href={`https://${domain}`} className="domain_card__link">
          <Flex align={Flex.align.CENTER} gap={Flex.gaps.XS}>
            <Text
              element="span"
              type={Text.types.TEXT1}
              weight={Text.weights.BOLD}
              style={{ fontSize: '20px' }}
            >
              {domain}
            </Text>
            <ExternalPage/>
          </Flex>
        </a>
        <Flex gap={Flex.gaps.SMALL}>
          <Button
            kind={Button.kinds.SECONDARY}
            onClick={() => refetch()}
            loading={!isLoading && isFetching}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            kind={Button.kinds.SECONDARY}
            color={Button.colors.NEGATIVE}
            disabled={isFetching}
          >
            Remove
          </Button>
        </Flex>
      </Flex>

      <ConfigSection domain={domain} domainInfo={domainInfo} />
    </div>
  );
}
