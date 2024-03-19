/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import { Button, Modal, ModalContent, ModalFooterButtons, ModalHeader, TextField } from 'monday-ui-react-core';
import { useForm } from 'react-hook-form';
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
  const [show, setShow] = useState(false);
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

  const handleClose = () => {
    setShow(false);
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
        setShow(false);
        form.reset();
      } else {
        form.setError('slug', { type: 'manual', message: response.error });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Button ref={openModalButtonRef} onClick={() => setShow(true)}>
        Add new link
      </Button>
      <Modal
        triggerElement={openModalButtonRef.current}
        show={show}
        onClose={handleClose}
        closeButtonAriaLabel={'close'}
      >
        <ModalHeader title="Add a new link"/>
        <ModalContent>
          <div className="link-modal__content">
            <form>
              <div className="link-modal__content">
                <TextField
                  required
                  requiredAsterisk
                  name="url"
                  title="URL"
                  type={TextField.types.URL}
                  placeholder="https://example.com"
                  {...form.register('url', { required: 'The URL is required' })}
                />
                <TextField
                  required
                  requiredAsterisk
                  name="slug"
                  title="Short name"
                  placeholder="nice-short-name"
                  validation={{
                    status: form.formState.errors.slug ? 'error' : undefined,
                    text: form.formState.errors.slug?.message,
                  }}
                  {...form.register('slug', { required: 'The short name is required' })}
                />
                <TextField
                  name="password"
                  title="Password"
                  placeholder="a memorable password"
                  {...form.register('password')}
                />
                <TextField
                  name="expiresAt"
                  title="Expires On"
                  type={TextField.types.DATE}
                  {...form.register('expiresAt')}
                />
              </div>
            </form>
          </div>
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
