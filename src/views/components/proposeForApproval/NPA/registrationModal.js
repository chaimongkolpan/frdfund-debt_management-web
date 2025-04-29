import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const RegistrationModal = (props) => {
  const {
    isOpen,
    setModal,
    centered,
    scrollable,
    title,
    children,
    hideFooter,
    onClose,
    closeText,
  } = props;

  const toggle = () => setModal(!isOpen);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={centered}
      scrollable={scrollable}
      fullscreen
    >
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        <>{children}</>
      </ModalBody>
      {!hideFooter && (
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            {closeText}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};
export default RegistrationModal;
