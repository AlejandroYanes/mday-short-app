/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import { Button, Modal, ModalContent, ModalFooterButtons, ModalHeader, TextField } from 'monday-ui-react-core';
import { useForm } from '@tanstack/react-form';

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';

export default function NewLinkModal() {
  const [show, setShow] = useState(false);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    defaultState: {
      url: '',
      slug: '',
      password: '',
      expiresAt: '',
    },
    onSubmit: async ({ value }) => {
      await linksAPI.create({
        ...value,
        password: value.password || null,
        expiresAt: value.expiresAt || null,
      });
      await queryClient.invalidateQueries({ queryKey: ['links'] });
      setShow(false);
      form.reset();
    }
  });

  const handleClose = () => {
    setShow(false);
    form.reset();
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
                <form.Field
                  name="url"
                  children={(field) => (
                    <TextField
                      required
                      requiredAsterisk
                      name={field.name}
                      title="URL"
                      type={TextField.types.URL}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com"
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                />
                <form.Field
                  name="slug"
                  children={(field) => (
                    <TextField
                      required
                      requiredAsterisk
                      name={field.name}
                      title="Short name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      placeholder="nice-short-name"
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                />
                <form.Field
                  name="password"
                  children={(field) => (
                    <TextField
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      title="Password"
                      placeholder="a memorable password"
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                />
                <form.Field
                  name="expiresAt"
                  children={(field) => (
                    <TextField
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      title="Expires On"
                      type={TextField.types.DATE}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                />
              </div>
            </form>
          </div>
        </ModalContent>
        <ModalFooterButtons
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={form.handleSubmit}
          onSecondaryButtonClick={handleClose}
        />
      </Modal>
    </>
  );
}
