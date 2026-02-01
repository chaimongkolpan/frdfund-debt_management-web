import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";
import { 
  getProvinces,
  updateFarmer,
} from "@services/api";
const FullModal = (props) => {
  const {isOpen, setModal, onClose, policy } = props;
  const [provinces, setProvOp] = useState(null);
  const [editDetail, setEditDetail] = useState(null);
  const toggle = () => setModal(!isOpen);
  const handleChange = async (key, val) => {
    await setEditDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const submitSave = async() => {
    const result = await updateFarmer(editDetail);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const getProvince = async () => {
    const resultProv = await getProvinces();
    if (resultProv.isSuccess) {
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
      await setProvOp(null);
    }
  }
  useEffect(() => {
    if (editDetail) return;
    setEditDetail(policy);
    getProvince();
  },[])
  return (editDetail && (
      <Modal isOpen={isOpen} toggle={toggle} scrollable fullscreen>
        <ModalHeader toggle={toggle}>รายละเอียดเกษตรกร</ModalHeader>
        <ModalBody>
          <form>
            <div className="mb-1">
              <div className="card shadow-none border my-4" data-component-card="data-component-card">
                <div className="card-body p-0">
                  <div className="p-4 code-to-copy">
                    <h3 className="text-center">รายละเอียดเกษตรกร</h3>
                    <br />
                    <div className="row g-3">
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'เลขบัตรประชาชน'} 
                          handleChange={(val) => handleChange('k_idcard', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_idcard} disabled
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'คำนำหน้า'} 
                          handleChange={(val) => handleChange('k_name_prefix', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_name_prefix}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'ชื่อ'} 
                          handleChange={(val) => handleChange('k_firstname', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_firstname}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'นามสกุล'} 
                          handleChange={(val) => handleChange('k_lastname', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_lastname}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'บ้านเลขที่'} 
                          handleChange={(val) => handleChange('k_house_no', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_house_no}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'บ้าน/ชุมชน'} 
                          handleChange={(val) => handleChange('k_village_name', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_village_name}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'ซอย'} 
                          handleChange={(val) => handleChange('k_soi', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_soi}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'ถนน'} 
                          handleChange={(val) => handleChange('k_road', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_road}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'ตำบล/แขวง'} 
                          handleChange={(val) => handleChange('k_sub_district', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_sub_district}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'} 
                          handleChange={(val) => handleChange('k_district', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_district}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        {provinces && (
                          <div className="form-floating form-floating-advance-select mb-3">
                            <label>จังหวัด</label>
                            <select className="form-select" value={editDetail.k_province ?? provinces[0]} onChange={(e) => handleChange('k_province', e.target?.value)}>
                              {provinces && (
                                provinces.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))
                              )}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'รหัสไปรษณีย์'} 
                          handleChange={(val) => handleChange('k_zipcode', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_zipcode}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'เบอร์โทรศัพท์'} 
                          handleChange={(val) => handleChange('k_mobile', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_mobile}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-4">
                        <Textbox title={'อีเมล'} 
                          handleChange={(val) => handleChange('k_email', val)} 
                          containerClassname={'mb-3'} value={editDetail.k_email}
                        />
                      </div>
                    </div>  
                    <br />
                    <div className="d-flex justify-content-center ">
                      <button className="btn btn-success" type="button" onClick={() => submitSave()}>บันทึก</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
        </ModalFooter>
      </Modal>
    )
  );
};
export default FullModal;