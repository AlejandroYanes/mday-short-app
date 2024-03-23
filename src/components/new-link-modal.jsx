/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import { Button, Modal, ModalContent, ModalFooterButtons, ModalHeader, TextField, Text } from 'monday-ui-react-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';
import { KEBAB_CASE_REGEX } from '../utils/constants';

const schema = z.object({
  url: z.string().url({ message: 'The url is invalid' }),
  slug: z.string().regex(KEBAB_CASE_REGEX, { message: 'The short name is invalid' }),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
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

export default function NewLinkModal() {
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    values: {
      url: '',
      slug: '',
      password: '',
      expiresAt: '',
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
    const value = form.getValues();
    try {
      const response = await linksAPI.create({
        ...value,
        password: value.password || null,
        expiresAt: value.expiresAt || null,
      });

      if (response.ok) {
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
        <ModalHeader title="Add a new link"/>
        <ModalContent>
          <form>
            <div className="link-modal__content">
              <Controller
                name="url"
                control={form.control}
                render={({field}) => (
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
                render={({field}) => (
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
                render={({field}) => (
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
                render={({field}) => (
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
