/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Flex,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader,
  TextField
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { usersAPI } from '../../api/users';
import { queryClient } from '../../utils/query';
import InputHint from '../../components/input-hint';

const schema = z.object({
  name: z.string()
    .min(2, { message: 'The name must have at least 2 characters' })
    .max(50, { message: 'The name can not have more than 50 characters' }),
  email: z.string()
    .min(1, { message: 'The email can not be empty' })
    .email({ message: 'Please use a valid email' }),
  role: z.any(),
});

const roleOptions = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'USER', label: 'User' },
  { value: 'GUEST', label: 'Guest' },
];

export default function InviteUserModal() {
  const [showModal, setShowModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const openModalButtonRef = useRef(null);

  const form = useForm({
    values: {
      name: '',
      email: '',
      role: roleOptions[1],
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
    console.log(payload);
    try {
      const response = await usersAPI.invite({ ...payload, role: payload.role.value });

      if (response.ok) {
        await queryClient.invalidateQueries({queryKey: ['users']});
        setShowModal(false);
        form.reset();
      } else {
        showError();
      }
    } catch (error) {
      console.error(error);
      showError();
    }
  }

  return (
    <>
      <Button ref={openModalButtonRef} onClick={() => setShowModal(true)}>
        Invite member
      </Button>
      <Modal
        triggerElement={openModalButtonRef.current}
        show={showModal}
        onClose={handleClose}
        closeButtonAriaLabel="close"
        data-testid="invite-user-modal"
      >
        <ModalHeader
          title={
            <Heading type={Heading.types.H3}>
              Invite a new user
            </Heading>
          }
        />
        <ModalContent>
          <form>
            <div className="link-modal__content">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    required
                    requiredAsterisk
                    title="Name"
                    type={TextField.types.TEXT}
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      status: form.formState.errors.name ? 'error' : undefined,
                      text: <InputHint text={form.formState.errors.name?.message} />
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    required
                    requiredAsterisk
                    title="Email"
                    placeholder="john@acme.com"
                    type={TextField.types.EMAIL}
                    size={TextField.sizes.MEDIUM}
                    validation={{
                      status: form.formState.errors.email ? 'error' : undefined,
                      text: <InputHint text={form.formState.errors.email?.message} />
                    }}
                    {...field}
                  />
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field }) => (
                  <Flex direction={Flex.directions.COLUMN} align={Flex.align.START}>
                    <label htmlFor="role" className="dropdown__label">
                      Role
                      <span className="dropdown__label__asterisk">*</span>
                    </label>
                    <Dropdown
                      required
                      requiredAsterisk
                      className="table-dropdown"
                      clearable={false}
                      searchable={false}
                      menuPosition="fixed"
                      options={roleOptions}
                      {...field}
                    />
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
          <div style={{ height: '40px' }} />
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
