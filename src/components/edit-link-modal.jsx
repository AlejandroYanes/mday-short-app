/* eslint-disable react/no-children-prop */
import { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader,
  TextField
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Edit } from 'monday-ui-react-core/icons';
import { useForm } from '@tanstack/react-form'

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';

export default function EditLinkModal(props) {
  const { link } = props;
  const [show, setShow] = useState(false);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    defaultValues: {
      url: link.url,
      slug: link.slug,
      password: link.password || '',
      expiresAt: link.expiresAt || '',
    },
    onSubmit: async ({ value }) => {
      await linksAPI.update({
        ...value,
        password: value.password || null,
        expiresAt: value.expiresAt || null,
        id: link.id,
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
      <IconButton
        icon={Edit}
        size={Button.sizes.XS}
        kind={Button.kinds.SECONDARY}
        ref={openModalButtonRef}
        onClick={() => setShow(true)}
      />
      <Modal
        triggerElement={openModalButtonRef.current}
        show={show}
        onClose={handleClose}
        closeButtonAriaLabel={'close'}
      >
        <ModalHeader title="Update link" />
        <ModalContent>
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
