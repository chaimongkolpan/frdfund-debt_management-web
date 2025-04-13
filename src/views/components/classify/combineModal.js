import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const FullModal = (props) => {
  const {isOpen, setModal, onOk, onClose} = props;
  const [selected, setSelected] = useState([]);
  const toggle = () => setModal(!isOpen);
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
                              <input className="form-check-input" id="bulk-select-example2" type="checkbox" data-bulk-select='{"body":"bulk-select-body2","actions":"bulk-select-actions2","replacedElement":"bulk-select-replace-element"}' />
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
                      <tbody className="list text-center align-middle" id="bulk-select-body2">
                        <tr>
                          <td className="fs-9">
                            <div className="form-check ms-2 mb-0 fs-8">
                              <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                            </div>
                          </td>
                          <td>1</td>
                          <td>กำลังดำเนินการ</td>
                          <td>1958</td>
                          <td>สหกรณ์</td>
                          <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                          <td>30,000.00</td>
                          <td>30,000.00</td>
                          <td>เพื่อการเกษตร</td>
                          <td>ผิดนัดชำระ</td>
                          <td>หลักทรัพย์ค้ำประกัน</td>
                        </tr>
                        <tr>
                          <td className="fs-9">
                            <div className="form-check ms-2 mb-0 fs-8">
                              <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                            </div>
                          </td>
                          <td>2</td>
                          <td>กำลังดำเนินการ</td>
                          <td>2525</td>
                          <td>สหกรณ์</td>
                          <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                          <td>10,000.00</td>
                          <td>10,000.00</td>
                          <td>เพื่อการเกษตร</td>
                          <td>ผิดนัดชำระ</td>
                          <td>หลักทรัพย์ค้ำประกัน</td>
                        </tr>
                        <tr>
                          <td className="fs-9">
                            <div className="form-check ms-2 mb-0 fs-8">
                              <input className="form-check-input" type="checkbox" data-bulk-select-row="{&quot;name&quot;:&quot;Anna&quot;,&quot;email&quot;:&quot;anna@example.com&quot;,&quot;age&quot;:18}" />
                            </div>
                          </td>
                          <td>3</td>
                          <td>กำลังดำเนินการ</td>
                          <td>2005</td>
                          <td>สหกรณ์</td>
                          <td>สหกรณ์การเกษตรเมืองมีนบุรี จำกัด</td>
                          <td>70,000.00</td>
                          <td>70,000.00</td>
                          <td>เพื่อการเกษตร</td>
                          <td>ผิดนัดชำระ</td>
                          <td>หลักทรัพย์ค้ำประกัน</td>
                        </tr>
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