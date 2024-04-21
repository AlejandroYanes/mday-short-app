/* eslint-disable react/no-children-prop,max-len */
import { useMemo, useRef, useState } from 'react';
import {
  Button,
  Dropdown, Flex,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader, Text,
  TextField
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../../api/links';
import { domainsApi } from '../../api/domains';
import { queryClient } from '../../utils/query';
import { KEBAB_CASE_REGEX } from '../../utils/constants';
import { monday } from '../../utils/monday';
import InputHint from '../../components/input-hint';

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

export default function NewLinkModal() {
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const openModalButtonRef = useRef(null);

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.list,
    refetchInterval: 60000 * 2, // 2 minutes
  });

  const form = useForm({
    values: {
      url: '',
      slug: '',
      password: '',
      expiresAt: '',
      domain: null,
    },
    resolver: zodResolver(schema),
  });

  const showError = () => {
    setShowErrorMessage(true);
    setTimeout(() => setShowErrorMessage(false), 5000);
  }

  const handleClose = () => {
    setShowModal(false);
    form.reset();
  }

  const handleSubmit = async () => {
    const values = form.getValues();

    try {
      const response = await linksAPI.create({
        ...values,
        password: values.password || null,
        expiresAt: values.expiresAt || null,
        domain: values.domain ? values.domain.label : null,
      });

      if (response.ok) {
        monday.execute('valueCreatedForUser');
        await queryClient.invalidateQueries({queryKey: ['links']});
        setShowModal(false);
        form.reset();
      } else {
        if (response.field === 'slug') {
          form.setError('slug', {type: 'manual', message: response.error});
        } else {
          showError();
        }
      }
    } catch (error) {
      console.error(error);
      showError();
    }
  }

  const filteredDomains = useMemo(() => (
    domains
      .filter((domain) => domain.verified && domain.configured)
      .map(({ id, name }) => ({ value: id, label: name }))
  ), [domains]);

  return (
    <>
      <Button ref={openModalButtonRef} onClick={() => setShowModal(true)}>
        Add new link
      </Button>
      <Modal
        triggerElement={openModalButtonRef.current}
        show={showModal}
        onClose={handleClose}
        closeButtonAriaLabel="close"
      >
        <ModalHeader
          title={
            <Heading type={Heading.types.H3} element="span">
              Add a new link
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
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      status: form.formState.errors.url ? 'error' : undefined,
                      text: <InputHint text={form.formState.errors.url?.message} />
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
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      status: form.formState.errors.slug ? 'error' : undefined,
                      text: <InputHint text={slugSuggestion} />
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
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      text: <InputHint text={passwordSuggestion} />
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
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      text: <InputHint text={expiresAtSuggestion} />
                    }}
                    {...field}
                  />
                )}
              />
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
            </div>
          </form>
          {showErrorMessage ? (
            <span style={{color: 'var(--color-error)'}}>
              Something went wrong. Please try again. If the issue persists, contact support.
            </span>
          ) : null}
        </ModalContent>
        <ModalFooterButtons
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={form.handleSubmit(handleSubmit)}
          onSecondaryButtonClick={handleClose}
        />
      </Modal>
    </>
  );
}
