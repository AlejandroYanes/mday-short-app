/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import { Button, Modal, ModalContent, ModalFooterButtons, ModalHeader, TextField } from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { linksAPI } from '../../api/links';
import { queryClient } from '../../utils/query';
import { KEBAB_CASE_REGEX } from '../../utils/constants';
import { monday } from '../../utils/monday';
import InputHint from '../../components/input-hint';

const schema = z.object({
  url: z.string().min(1, { message: 'The url can not be empty' }).url({ message: 'The url is invalid' }),
  slug: z.string().min(1, { message: 'The short name can not be empty' }).regex(KEBAB_CASE_REGEX, { message: 'The short name is invalid' }),
  password: z.string().nullish(),
  expiresAt: z.string().nullish(),
});

const slugSuggestion = (
  <>
    Use words linked by {`"-"`} and do not use any other <br/>
    special character (eg: /, %, $, etc). Preferably use 2-5 words.
  </>
);

const passwordSuggestion = 'In case you want to restrict who can access the link.';

const expiresAtSuggestion = 'Set an expiration date for the link, after this date the link will be disabled.';

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
    const payload = form.getValues();
    try {
      const response = await linksAPI.create({
        ...payload,
        password: payload.password || null,
        expiresAt: payload.expiresAt || null,
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
                    validation={{
                      text: <InputHint text={expiresAtSuggestion} />
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
