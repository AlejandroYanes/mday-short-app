/* eslint-disable react/no-children-prop */
import { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader,
  TextField,
  Tooltip,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
// eslint-disable-next-line import/no-unresolved
import { Edit } from 'monday-ui-react-core/icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../../api/links';
import { queryClient } from '../../utils/query';
import { stripTimezone } from '../../utils/dates';
import { KEBAB_CASE_REGEX } from '../../utils/constants';
import { useAuth } from '../../providers/auth';

const schema = z.object({
  url: z.string().min(1, { message: 'The url can not be empty' }).url({ message: 'The url is invalid' }),
  slug: z.string().min(1, { message: 'The short name can not be empty' }).regex(KEBAB_CASE_REGEX, { message: 'The short name is invalid' }),
  password: z.string().nullish(),
  expiresAt: z.string().nullish(),
});

const slugSuggestion = (
  <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
    <span style={{fontSize: '14px' }}>
      Use words linked by {`"-"`} and do not use any other <br/>
      special character (eg: /, %, $, etc). Preferable use 2-5 words.
    </span>
  </div>
);

const passwordSuggestion = (
  <div style={{paddingLeft: '14px', marginTop: '4px' }}>
    <span style={{fontSize: '14px' }}>
      In case you want to restrict who can access the link.
    </span>
  </div>
);

const expiresAtSuggestion = (
  <div style={{paddingLeft: '14px', marginTop: '4px' }}>
    <span style={{fontSize: '14px' }}>
      Set an expiration date for the link, after this date the link will be disabled.
    </span>
  </div>
);

export default function EditLinkModal(props) {
  const { link } = props;

  const { role } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    values: {
      url: link.url,
      slug: link.slug,
      password: link.password || '',
      expiresAt: link.expiresAt ? stripTimezone(link.expiresAt) : '',
    },
    resolver: zodResolver(schema),
  });

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(false), 5000);
  }

  const handleClose = () => {
    setShowModal(false);
    form.reset();
  }

  const handleSubmit = async () => {
    const value = form.getValues();
    try {
      const response = await linksAPI.update({
        ...value,
        password: value.password || null,
        expiresAt: value.expiresAt || null,
        id: link.id,
      });

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ['links'] });
        setShowModal(false);
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
      console.error(error);
      showError();
    }
  }

  return (
    <>
      <Tooltip content="Edit link" position={Tooltip.positions.LEFT} withMaxWidth>
        <IconButton
          icon={Edit}
          size={Button.sizes.XS}
          kind={Button.kinds.SECONDARY}
          ref={openModalButtonRef}
          disabled={role === 'GUEST'}
          onClick={() => setShowModal(true)}
        />
      </Tooltip>
      <Modal
        triggerElement={openModalButtonRef.current}
        show={showModal}
        onClose={handleClose}
        closeButtonAriaLabel="close"
      >
        <ModalHeader
          title={
            <Heading type={Heading.types.H3}>
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
                      text: form.formState.errors.url?.message,
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
                      text: form.formState.errors.slug?.message ?? slugSuggestion,
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
                      text: passwordSuggestion,
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
                    validation={{
                      text: expiresAtSuggestion,
                    }}
                    {...field}
                  />
                )}
              />
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
          onSecondaryButtonClick={handleClose}
        />
      </Modal>
    </>
  );
}
