/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import { Button, Modal, ModalContent, ModalFooterButtons, ModalHeader, TextField } from 'monday-ui-react-core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';

const schema = z.object({
  url: z.string().url(),
  slug: z.string().min(4),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
});

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
        await queryClient.invalidateQueries({ queryKey: ['links'] });
        setShowModal(false);
        form.reset();
      } else {
        if (response.field === 'slug') {
          form.setError('slug', { type: 'manual', message: response.error });
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
                      text: form.formState.errors.slug?.message,
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
