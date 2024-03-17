import React, { useCallback, useRef, useState } from 'react';
import mondaySdk from "monday-sdk-js";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooterButtons,
  TextField,
} from 'monday-ui-react-core';
import { ExternalPage } from 'monday-ui-react-core/icons';
import "monday-ui-react-core/dist/main.css";
import "./App.css";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();


const TableEmptyState = () => <h1 style={{ textAlign: "center" }}>Empty State</h1>;
const TableErrorState = () => <h1 style={{ textAlign: "center" }}>Error State</h1>;

const columns = [
  {
    id: 'baseLink',
    loadingStateType: 'medium-text',
    title: 'Board Link',
    width: 300,
  },
  {
    id: 'slug',
    loadingStateType: 'medium-text',
    title: 'Short name',
    width: 150,
  },
  {
    id: 'visitors',
    loadingStateType: 'medium-text',
    title: 'Visitors',
    width: 150,
  },
  {
    id: 'views',
    loadingStateType: 'medium-text',
    title: 'Views',
    width: 150,
  },
  {
    id: 'preview',
    loadingStateType: 'medium-text',
    title: '',
    width: 100,
  },
];

const App = () => {
  // const [context, setContext] = useState();
  //
  // useEffect(() => {
  //   // Notice this method notifies the monday platform that user gains a first value in an app.
  //   // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
  //   // monday.execute("valueCreatedForUser");
  //
  //   // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
  //   monday.listen("context", (res) => {
  //     setContext(res.data);
  //   });
  // }, []);

  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  // const attentionBoxText = `Hello, your user_id is: ${
  //   context ? context.user.id : "still loading"
  // }.
  // Let's start building your amazing app, which will change the world!`;

  const [show, setShow] = useState(false);
  const openModalButtonRef = useRef(null);
  const closeModal = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div className="app">
      <div className="tool-bar">
        <Button ref={openModalButtonRef} onClick={() => setShow(true)}>
          Add new link
        </Button>
        <Modal triggerElement={openModalButtonRef.current} show={show} onClose={closeModal} closeButtonAriaLabel={"close"}>
          <ModalHeader title="Add a new link" />
          <ModalContent>
            <div className="create-modal__content">
              <TextField name="link" title="Link" />
              <TextField name="slug" title="Short name" />
            </div>
          </ModalContent>
          <ModalFooterButtons primaryButtonText="Confirm" secondaryButtonText="Cancel" onPrimaryButtonClick={closeModal} onSecondaryButtonClick={closeModal} />
        </Modal>
      </div>
      <div className="table-container">
        <Table columns={columns} emptyState={<TableEmptyState />} errorState={<TableErrorState />}>
          <TableHeader>
            <TableHeaderCell title="Board Url" />
            <TableHeaderCell title="Short name" className="table-cell--center" />
            <TableHeaderCell title="Visitors" className="table-cell--center" />
            <TableHeaderCell title="Views" className="table-cell--center" />
            <TableHeaderCell title="Preview" className="table-cell--center" />
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>https://monday.com</TableCell>
              <TableCell className="table-cell--center">monday</TableCell>
              <TableCell className="table-cell--center">1000</TableCell>
              <TableCell className="table-cell--center">2000</TableCell>
              <TableCell className="table-cell--center">
                <IconButton icon={ExternalPage} size={Button.sizes.XS} kind={Button.kinds.SECONDARY} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default App;
