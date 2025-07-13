
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function Loading(props) {
  const {isOpen, setModal, centered, scrollable, size, fullscreen, title, children, hideFooter, onOk, okText, onClose, closeText, timeout, onTimeout} = props;

  const toggle = () => setModal(!isOpen);
  if (timeout) {
    setTimeout(onTimeout, timeout);
  }
  return (
      <Modal isOpen={isOpen} toggle={toggle} size={size} centered={centered} scrollable={scrollable} fullscreen={fullscreen}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        {!hideFooter && (
          <ModalFooter>
            <Button color="success" onClick={onOk}>{okText}</Button>{' '}
            <Button color="secondary" onClick={onClose}>{closeText}</Button>
          </ModalFooter>
        )}
      </Modal>
  );
}

export default Loading;