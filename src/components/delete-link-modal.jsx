/* eslint-disable react/no-children-prop,max-len */
import { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalFooterButtons,
  ModalHeader,
} from 'monday-ui-react-core';
// eslint-disable-next-line import/no-unresolved
import { Delete } from 'monday-ui-react-core/icons';

import { linksAPI } from '../api/links';
import { queryClient } from '../utils/query';

export default function DeleteLinkModal(props) {
  const { link } = props;
  const [show, setShow] = useState(false);
  const openModalButtonRef = useRef(null);

  const deleteLink = async () => {
    await linksAPI.delete(link.id);
    await queryClient.invalidateQueries({ queryKey: ['links'] });
    setShow(false);
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
        onClick={() => setShow(true)}
      />
      <Modal
        alertDialog
        triggerElement={openModalButtonRef.current}
        show={show}
        onClose={handleClose}
        closeButtonAriaLabel={'close'}
      >
        <ModalHeader title="Are you absolutely sure?"/>
        <ModalContent className="link-modal__content">
          Are you sure you want to delete the link? This action cannot be undone.
        </ModalContent>
        <ModalFooterButtons
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onPrimaryButtonClick={deleteLink}
          onSecondaryButtonClick={handleClose}
        />
      </Modal>
    </>
  );
}
