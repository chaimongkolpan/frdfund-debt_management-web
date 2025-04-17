import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const FullModal = (props) => {
  const {isOpen, setModal, onOk, onClose, data} = props;
  const [selected, setSelected] = useState([]);
  const toggle = () => setModal(!isOpen);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9">
          <div className="form-check ms-2 mb-0 fs-8">
            <input className="form-check-input" type="checkbox" />
          </div>
        </td>
        <td>{index + 1}</td>
        <td>{item.checking_management_status}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{item.creditor_type}</td>
        <td>{item.creditor_name}</td>
        <td>{item.debt_manage_outstanding_principal}</td>
        <td>{item.frD_paymen_amount}</td>
        <td>{item.purpose_loan_contract}</td>
        <td>{item.dept_status}</td>
        <td>{item.collateral_type}</td>
      </tr>
    ))
  }
  return (
      <Modal isOpen={isOpen} toggle={toggle} scrollable fullscreen>
        <ModalHeader toggle={toggle}>รวมสัญญา</ModalHeader>
        <ModalBody>
          <form>
            <div id="tableExample3" data-list='{"valueNames":["id","name","province"]}'>
              <div className="table-responsive mx-n1 px-1">
                <div id="tableExample1" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
                  <div className="table-responsive mx-n1 px-1">
                    <table className="table table-sm table-bordered fs-9 mb-0">
                      <thead className="align-middle text-center text-nowrap" style={{backgroundColor: '#d9fbd0',border: '#cdd0c7'}}>
                        <tr>
                          <th className="white-space-nowrap fs-9 ps-0" rowSpan="2" style={{ minWidth: 30 }}>
                            <div className="form-check ms-2 mb-0 fs-8">
                              <input className="form-check-input" type="checkbox" data-bulk-select='{"body":"bulk-select-body2","actions":"bulk-select-actions2","replacedElement":"bulk-select-replace-element"}' />
                            </div>
                          </th>
                          <th style={{ minWidth: 30 }}>#</th>
                          <th>สถานะสัญญาจำแนกมูลหนี้</th>
                          <th>เลขที่สัญญา</th>
                          <th>ประเภทเจ้าหนี้</th>
                          <th>สถานบันเจ้าหนี้</th>
                          <th>เงินต้นคงเหลือตามสัญญา</th>
                          <th>กฟก.ชำระเงินจำนวน</th>
                          <th>วัตถุประสงค์การกู้</th>
                          <th>สถานะหนี้</th>
                          <th>ประเภทหลักประกัน </th>
                        </tr>
                      </thead>
                      <tbody className="list text-center align-middle">
                        {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                          <tr>
                            <td className="fs-9 text-center align-middle" colSpan={11}>
                              <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </form>
        </ModalBody>
        <ModalFooter>
          {(selected && selected.length > 0) && (
            <Button color="primary" onClick={onOk}>รวมสัญญา</Button>
          )}{' '}
          <Button color="secondary" onClick={onClose}>ยกเลิก</Button>
        </ModalFooter>
      </Modal>
  );
};
export default FullModal;