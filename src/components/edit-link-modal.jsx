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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';
import { stripTimezone } from '../utils/dates';

const schema = z.object({
  url: z.string().url(),
  slug: z.string().min(4),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
});

export default function EditLinkModal(props) {
  const { link } = props;
  const [show, setShow] = useState(false);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    defaultValues: {
      url: link.url,
      slug: link.slug,
      password: link.password || '',
      expiresAt: link.expiresAt ? stripTimezone(link.expiresAt) : '',
    },
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    setShow(false);
    form.reset();
  }

  const handleSubmit = async ({ value }) => {
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
              <TextField
                required
                requiredAsterisk
                name="url"
                title="URL"
                placeholder="https://example.com"
                {...form.register('url', { required: 'The URL is required' })}
              />
              <TextField
                required
                requiredAsterisk
                name="slug"
                title="Short name"
                placeholder="nice-short-name"
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
