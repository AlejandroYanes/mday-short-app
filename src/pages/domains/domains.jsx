import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, TextField } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DOMAIN_NAME_REGEX } from '../../utils/constants';
import { monday } from '../../utils/monday';
import { domainsApi } from '../../api/domains';
import InputHint from '../../components/input-hint';
import DomainCard from './domain-card';
import './styles.css';

const schema = z.object({
  domain: z.string()
    .min(1, { message: 'The domain name can not be empty' })
    .regex(DOMAIN_NAME_REGEX, { message: 'The domain name is invalid' }),
});

export default function DomainsPage() {
  const { data: domains = [], refetch } = useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.list,
  });

  const form = useForm({
    values: {
      domain: '',
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => domainsApi.add(values.domain),
    onSuccess: (values) => {
      form.reset();
      refetch();
    },
    onError: (error) => {
      monday.execute('notice', {
        message: error,
        type: 'error',
        timeout: 2000,
      });
    }
  });

  return (
    <div className="page page--small">
      <Heading>Domains</Heading>
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
      {domains.map((domain) => (
        <DomainCard domain={domain.name} key={domain.name}/>
      ))}
    </div>
  );
}
