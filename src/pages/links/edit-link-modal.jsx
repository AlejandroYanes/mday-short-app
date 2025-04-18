/* eslint-disable react/no-children-prop */
import { useEffect, useMemo, useState } from 'react';
import {
  Button, Dropdown, Flex,
  IconButton,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader, Text,
  TextField,
  Tooltip,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
// eslint-disable-next-line import/no-unresolved
import { Edit } from 'monday-ui-react-core/icons';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { linksAPI } from '../../api/links';
import { domainsApi } from '../../api/domains';
import { queryClient } from '../../utils/query';
import { KEBAB_CASE_REGEX } from '../../utils/constants';
import { useAuth } from '../../providers/auth';
import InputHint from '../../components/input-hint';
import RenderIf from '../../components/render-if';

const schema = z.object({
  url: z.string()
    .min(1, { message: 'The url can not be empty' })
    .url({ message: 'The url is invalid' }),
  slug: z.string()
    .min(1, { message: 'The short name can not be empty' })
    .regex(KEBAB_CASE_REGEX, { message: 'The short name is invalid' }),
  password: z.string().nullish(),
  expiresAt: z.string().nullish(),
  domain: z.any().nullish(),
});

const slugSuggestion = (
  <>
    Use words linked by {`"-"`} and do not use any other <br/>
    special character (eg: /, %, $, etc). Preferably use 2-5 words.
  </>
);

const passwordSuggestion = 'In case you want to restrict who can access the link.';
const expiresAtSuggestion = 'Set an expiration date for the link, after this date the link will be disabled.';
const domainSuggestion = 'Select a domain to use for the link. Using a domain will remove the workspace short name from the link.';
const noDomainSuggestion = 'Add new custom domains to use them here.';

function EditLinkModal(props) {
  const { link, onClose } = props;

  const { isPremium } = useAuth();

  const [errorMessage, setErrorMessage] = useState(null);

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.list,
    refetchInterval: 60000 * 2, // 2 minutes
    enabled: isPremium,
  });

  const form = useForm({
    values: {
      url: link.url,
      slug: link.slug,
      password: link.password || '',
      expiresAt: link.expiresAt ? format(new Date(link.expiresAt), 'yyyy-MM-dd') : '',
      domain: null,
    },
    resolver: zodResolver(schema),
  });

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(false), 5000);
  }

  const handleSubmit = async () => {
    const values = form.getValues();
    try {
      const response = await linksAPI.update({
        ...values,
        password: values.password || null,
        expiresAt: values.expiresAt || null,
        domain: values.domain ? values.domain.label : null,
        id: link.id,
      });

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ['links'] });
        onClose();
        form.reset();
      } else {
        if (response.field === 'slug') {
          form.setError('slug', { type: 'manual', message: response.error });
        } if (response.field === 'not-found') {
          showError(response.error);
        } else {
          showError();
        }
      }
    } catch (error) {
      showError();
    }
  }

  const filteredDomains = useMemo(() => (
    domains
      .filter((domain) => domain.verified && domain.configured)
      .map(({ id, name }) => ({ value: id, label: name }))
  ), [domains]);

  useEffect(() => {
    if (filteredDomains.length > 0) {
      const connectedDomain = filteredDomains.find((domain) => domain.label === link.domain);
      if (connectedDomain) {
        form.setValue('domain', connectedDomain);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredDomains]);

  return (
    <>
      <Tooltip content="Edit link" position={Tooltip.positions.LEFT} withMaxWidth>
        <IconButton
          icon={Edit}
          size={Button.sizes.XS}
          kind={Button.kinds.SECONDARY}
        />
      </Tooltip>
      <Modal
        show
        onClose={onClose}
        closeButtonAriaLabel="close"
      >
        <ModalHeader
          title={
            <Heading type={Heading.types.H3} element="span">
              Update Link
            </Heading>
          }
        />
        <ModalContent>
          <form>
            <div className="link-modal__content">
              <Controller
                name="url"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    required
                    requiredAsterisk
                    title="URL"
                    placeholder="https://example.com"
                    type={TextField.types.URL}
                    validation={{
                      status: form.formState.errors.url ? 'error' : undefined,
                      text: <InputHint text={form.formState.errors.url?.message} />,
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    required
                    requiredAsterisk
                    title="Short name"
                    placeholder="nice-short-name"
                    validation={{
                      status: form.formState.errors.slug ? 'error' : undefined,
                      text: <InputHint text={slugSuggestion} />,
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    title="Password"
                    placeholder="a memorable password"
                    validation={{
                      text: <InputHint text={passwordSuggestion} />,
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                name="expiresAt"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    title="Expires On"
                    type={TextField.types.DATE}
                    minDate={new Date()}
                    validation={{
                      text: <InputHint text={expiresAtSuggestion} />,
                    }}
                    {...field}
                  />
                )}
              />
              <RenderIf condition={isPremium}>
                <Controller
                  name="domain"
                  control={form.control}
                  render={({ field }) => (
                    <Flex direction={Flex.directions.COLUMN} align={Flex.align.STRETCH} gap={Flex.gaps.XS}>
                      <Text type={Text.types.TEXT2}>Domain</Text>
                      <Dropdown
                        title="Domain"
                        clearable
                        searchable={false}
                        placeholder="Choose from your domains"
                        size={Dropdown.sizes.MEDIUM}
                        disabled={isLoading || filteredDomains.length === 0}
                        options={filteredDomains}
                        menuPosition={Dropdown.menuPositions.FIXED}
                        {...field}
                      />
                      <InputHint text={!isLoading && filteredDomains.length > 0 ? domainSuggestion : noDomainSuggestion} light />
                    </Flex>
                  )}
                />
              </RenderIf>
            </div>
          </form>
          {errorMessage ? (
            <span style={{color: 'var(--color-error)'}}>
              Something went wrong. Please try again. If the issue persists, contact support.
            </span>
          ) : null}
        </ModalContent>
        <ModalFooterButtons
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={form.handleSubmit(handleSubmit)}
          onSecondaryButtonClick={onClose}
        />
      </Modal>
    </>
  );
}

export default function EditLinkModalWrapper(props) {
  const [showModal, setShowModal] = useState(false);

  const { role } = useAuth();

  if (showModal) {
    return <EditLinkModal {...props} onClose={() => setShowModal(false)} />;
  }

  return (
    <IconButton
      icon={Edit}
      size={Button.sizes.XS}
      kind={Button.kinds.SECONDARY}
      disabled={role === 'GUEST'}
      onClick={() => setShowModal(true)}
    />
  );
}
