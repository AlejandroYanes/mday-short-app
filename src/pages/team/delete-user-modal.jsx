/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader,
  Text,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Heading } from 'monday-ui-react-core/next';
// eslint-disable-next-line import/no-unresolved
import { Delete } from 'monday-ui-react-core/icons';

import { usersAPI } from '../../api/users';
import { queryClient } from '../../utils/query';

export default function DeleteUserModal(props) {
  const { user, disabled } = props;
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const openModalButtonRef = useRef(null);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(false), 5000);
  }

  const deleteLink = async () => {
    try {
      const response = await usersAPI.delete(user.id);

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        setShow(false);
      } else {
        if (response.field === 'not-found') {
          showError(response.error);
        } else {
          showError('Something went wrong. Please try again. If the issue persists, contact support.');
        }
      }
    } catch (e) {
      console.error(e);
      showError('Something went wrong. Please try again. If the issue persists, contact support.');
    }
  };

  const handleClose = () => {
    setShow(false);
  }

  return (
    <>
      <IconButton
        icon={Delete}
        size={Button.sizes.XS}
        kind={Button.kinds.SECONDARY}
        ref={openModalButtonRef}
        disabled={disabled}
        onClick={() => setShow(true)}
      />
      <Modal
        alertDialog
        triggerElement={openModalButtonRef.current}
        show={show}
        onClose={handleClose}
        closeButtonAriaLabel={'close'}
      >
        <ModalHeader
          title={
            <Heading type={Heading.types.H3}>
              Are absolutely you sure?
            </Heading>
          }
        />
        <ModalContent className="link-modal__content">
          <Text type={Text.types.TEXT1} element="p">
            Are you sure you want to remove <strong>{user.name}</strong> from this workspace?
            This action cannot be undone.
          </Text>
          {errorMessage ? (
            <span style={{color: 'var(--color-error)'}}>
              {errorMessage}
            </span>
          ) : null}
        </ModalContent>
        <ModalFooterButtons
          primaryButtonText="Remove"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={deleteLink}
          onSecondaryButtonClick={handleClose}
        />
      </Modal>
    </>
  );
}
