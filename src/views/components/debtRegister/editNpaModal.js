import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import AreaTextbox from "@views/components/input/AreaTextbox";
import NpaRoundText from "@views/components/input/NpaRoundText";
import { 
  getProvinces,
} from "@services/api";
const FullModal = (props) => {
  const { isOpen, setModal, onOk, onClose, debt, setDebt } = props;
  const [provOp, setProvOp] = useState(null);
  const toggle = () => setModal(!isOpen);
  const onSubmit = async() => {
    await onOk(debt);
  }
  const handleChangeDebt = async (key, val) => {
    await setDebt((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  async function getFilter() {
    const resultProv = await getProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
       await setProvOp(null);
    }
  }
  useEffect(() => {
    getFilter();
  },[])
  return (
        <Modal size='xl' isOpen={isOpen} toggle={toggle} centered scrollable>
          <ModalHeader toggle={toggle}>{'แก้ไขทะเบียนหนี้ NPA'}</ModalHeader>
          <ModalBody>
            <div className="card-body p-0">
              <div className="p-4 code-to-copy">
                <div className="row">
                  <h3 className="text-center mb-4">รายละเอียดทะเบียนหนี้ NPA</h3>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'เลขบัตรประชาชน'} 
                      containerClassname={'mb-3'} value={debt.id_card} disabled
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'ชื่อ-นามสกุล'} 
                      containerClassname={'mb-3'} value={(debt.firstname ?? '') + ' ' + (debt.lastname ?? '')} disabled
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <NpaRoundText containerClassname={'mb-3'} value={debt?.npA_round}
                      handleChange={(val) => handleChangeDebt('npA_round', val)}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-floating needs-validation mb-3">
                      <select className="form-select mb-3" value={debt?.title_document_type ?? ''} onChange={(e) => handleChangeDebt('title_document_type', e.target?.value)}>
                        <option value="โฉนด">โฉนด</option>
                        <option value="ตราจอง">ตราจอง</option>
                        <option value="น.ส.3">น.ส.3</option>
                        <option value="น.ส.3 ก">น.ส.3 ก</option>
                        <option value="น.ส.3 ข">น.ส.3 ข</option>
                        <option value="ส.ป.ก.">ส.ป.ก.</option>
                        <option value="หนังสือแสดงกรรมสิทธิ์ห้องชุด">หนังสือแสดงกรรมสิทธิ์ห้องชุด</option>
                        <option value="ภ.ท.บ.5">ภ.ท.บ.5</option>
                        <optgroup label="________________________________________"></optgroup>
                        <option value="บ้าน">บ้าน</option>
                        <option value="สังหาริมทรัพย์">สังหาริมทรัพย์</option>
                        <option value="หุ้น">หุ้น</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                      <label htmlFor="floatingSelectTeam">หลักประกัน</label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'อื่นๆโปรดระบุ'} 
                      handleChange={(val) => handleChangeDebt('other', val)} 
                      containerClassname={'mb-3'} value={debt?.other}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'หลักประกันเลขที่'} 
                      handleChange={(val) => handleChangeDebt('title_document_no', val)} 
                      containerClassname={'mb-3'} value={debt?.title_document_no}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'ตำบล'} 
                      handleChange={(val) => handleChangeDebt('sub_district', val)} 
                      containerClassname={'mb-3'} value={debt?.sub_district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <Textbox title={'อำเภอ'} 
                      handleChange={(val) => handleChangeDebt('district', val)} 
                      containerClassname={'mb-3'} value={debt?.district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-floating form-floating-advance-select mb-3">
                      <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                      <select className="form-select" value={debt?.province} onChange={(e) => handleChangeDebt('province', e.target?.value)}>
                        {provOp && (
                          provOp.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <AreaTextbox title={'เนื้อที่'} containerClassname={'mb-3'}
                      handleChangeRai={(val) => handleChangeDebt('rai', val)} 
                      rai={debt?.rai ?? 0}
                      handleChangeNgan={(val) => handleChangeDebt('ngan', val)} 
                      ngan={debt?.ngan ?? 0}
                      handleChangeWa={(val) => handleChangeDebt('sqaure_wa', val)} 
                      wa={debt?.sqaure_wa ?? 0}
                    />
                  </div>
                </div>
                <br />
                <div className="d-flex justify-content-center ">
                  <button className="btn btn-success" type="button" onClick={() => onSubmit()}>บันทึก</button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={onClose}>{'ปิด'}</Button>
          </ModalFooter>
        </Modal>
  );
};
export default FullModal;