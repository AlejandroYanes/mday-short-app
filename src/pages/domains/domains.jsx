import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Text, TextField } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DOMAIN_NAME_REGEX } from '../../utils/constants';
import { monday } from '../../utils/monday';
import { domainsApi } from '../../api/domains';
import InputHint from '../../components/input-hint';
import ErrorScreen from '../../components/error-screen';
import DomainCard from './domain-card';
import SkeletonCard from './skeleton-card';
import './styles.css';

const schema = z.object({
  domain: z.string()
    .min(1, { message: 'The domain name can not be empty' })
    .regex(DOMAIN_NAME_REGEX, { message: 'The domain name is invalid' }),
});

export default function DomainsPage() {
  const { data: domains = [], refetch, isLoading, isError } = useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.list,
    refetchInterval: 60000 * 2, // 2 minutes
  });

  const form = useForm({
    values: {
      domain: '',
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => domainsApi.add(values.domain),
    onSuccess: () => {
      form.reset();
      refetch();
    },
    onError: (error) => {
      console.log(error);
      monday.execute('notice', {
        message: error.message,
        type: 'error',
        timeout: 2000,
      });
    }
  });

  if (isError) {
    return (
      <ErrorScreen title="Failed to load domains" centered={false}>
        <Text type={Text.types.TEXT1} align={Text.align.CENTER}>
          An error occurred while trying to fetch your domains.
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
    <div className="page page--small">
      <div>
        <Heading>Domains</Heading>
        <Text type={Text.types.TEXT1} element="p">
          Add domains to create branded short links, these will be used when creating new links.
          <br />
          This way, you can create short links that match your brand.
          <br />
          Also, your links will not have the Workspace name in them, making them even shorter.
        </Text>
      </div>
      <form
        onSubmit={form.handleSubmit(mutate)}
      >
        <Flex style={{ width: '380px' }} align={Flex.align.START} gap={Flex.gaps.MEDIUM}>
          <Controller
            name="domain"
            control={form.control}
            render={({field}) => (
              <TextField
                placeholder="example.com"
                type={TextField.types.TEXT}
                size={TextField.sizes.MEDIUM}
                styles={{ width: '300px' }}
                validation={{
                  status: form.formState.errors.domain ? 'error' : undefined,
                  text: <InputHint text={form.formState.errors.domain?.message}/>
                }}
                {...field}
              />
            )}
          />
          <Button type={Button.types.SUBMIT} loading={isPending} style={{ padding: '8px 20px' }}>Add</Button>
        </Flex>
      </form>
      {isLoading ? (
        <>
          <SkeletonCard/>
          <SkeletonCard/>
          <SkeletonCard/>
        </>
      ) : null}
      {domains.map((domain) => (
        <DomainCard domain={domain.name} key={domain.name}/>
      ))}
    </div>
  );
}
