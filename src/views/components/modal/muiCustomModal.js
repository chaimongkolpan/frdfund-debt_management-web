import React from 'react';
import { Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const CustomModal = (props) => {
  const {isOpen, setModal, fullscreen, size, centered, scrollable, title, children, hideFooter, hideOk, onOk, okText, okColor, onClose, closeText} = props;
  return (
    <div className={`modal ${isOpen ? "show" : ""}`} style={{ display: 'block', position: 'initial' }}>
      <Modal.Dialog show={isOpen ? "true" : "false"}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {!hideFooter && (
          <Modal.Footer>
            {!hideOk && (
              <>
                <Button color={`${okColor ? okColor : "success"}`} onClick={onOk}>{okText}</Button>{' '}
              </>
            )}
            <Button color="secondary" onClick={onClose}>{closeText}</Button>
          </Modal.Footer>
        )}
      </Modal.Dialog>
    </div>
  );
};
export default CustomModal;