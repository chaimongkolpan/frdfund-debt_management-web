import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import Dropdown from "@views/components/input/DropdownSearch";
import DatePicker from "@views/components/input/DatePicker";
import { ToDateDb } from "@utils";
import { 
  getProvinces,
  getLegalBorrowerPolicy,
  updateLegalBorrowerPolicy,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const FullModal = (props) => {
  const { policy, onClose } = props;
  const [isMounted, setMounted] = useState(false);
  const [provinces, setProvOp] = useState(null);
  const [selectedType, setSelectedType] = useState('ผู้กู้');
  const [editDetail, setEditDetail] = useState(null);
  const toggle = () => setModal(!isOpen);
  const handleChange = async (key, val) => {
    await setEditDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const submitBorrower = async() => {
    const result = await updateLegalBorrowerPolicy({ ...editDetail, borrower_birthday: ToDateDb(editDetail?.borrower_birthday), is_active: editDetail?.is_active == 1, id_KFKPolicy: policy?.id_KFKPolicy, id_card: policy?.k_idcard });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await setTimeout(() => {onClose()}, 500);
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
  const fetchData = async() => {
    const result = await getLegalBorrowerPolicy(policy?.id_KFKPolicy);
    if (result.isSuccess && result.data) {
      setEditDetail(result.data);
    } else {
      setEditDetail({ id_KFKPolicy: policy?.id_KFKPolicy, id_card: policy?.k_idcard, reason_borrower_status: 'เสียชีวิต', reason_other: '', borrower_idcard: '', borrower_name_prefix: '', borrower_firstname: '', borrower_lastname: '', borrower_birthday: '', borrower_house_no: '', borrower_village_name: '', borrower_soi: '', borrower_road: '', borrower_sub_district: '', borrower_district: '', borrower_province: '', borrower_zipcode: '', borrower_mobile: '', borrower_email: '' });
    }
    await setMounted(true);
  }
  useEffect(() => {
    if (!isMounted) {
      getProvince();
      fetchData();
    }
  },[])
  return (
    <form>
      {editDetail && (
        <div className="mb-1">
          <div className="card shadow-none border my-4" data-component-card="data-component-card">
            <div className="card-body p-0">
              <div className="p-4 code-to-copy">
                <h3 className="text-center">ผู้รับสภาพหนี้แทน</h3>
                <br />
                <div className="row g-3">
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className='form-switch'>
                      <div className='d-flex flex-row-reverse align-items-center gap-2'>
                          <p className='fw-bold mb-0'>สถานะผู้รับสภาพหนี้แทน</p>
                          <Input 
                            type='switch' 
                            name='is_active' 
                            onChange={(e) => handleChange( 'is_active', e.target.checked ? 1 : 0)} 
                            checked={editDetail?.is_active == 1} 
                          />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <div className="form-floating needs-validation">
                      <select className="form-select" onChange={(e) => handleChange('reason_borrower_status', e.target?.value)} value={editDetail.reason_borrower_status}>
                        <option value="เสียชีวิต">เสียชีวิต</option>
                        <option value="ผู้จัดการมรดก">ผู้จัดการมรดก</option>
                        <option value="ติดคุก">ติดคุก</option>
                        <option value="พิการ/ทุพพคลภาพ">พิการ/ทุพพคลภาพ</option>
                        <option value="ขาดการติดต่อ">ขาดการติดต่อ</option>
                        <option value="บุคคลค้ำประกัน">บุคคลค้ำประกัน</option>
                        <option value="เจ้าของหลักประกัน">เจ้าของหลักประกัน</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                      <label>เหตุผล</label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'อื่นๆโปรดระบุ'} 
                      handleChange={(val) => handleChange('reason_other', val)} 
                      containerClassname={'mb-3'} value={editDetail.reason_other}
                      disabled={editDetail.reason_borrower_status != 'อื่นๆ'}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'เลขบัตรประชาชน'} 
                      handleChange={(val) => handleChange('borrower_idcard', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_idcard}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'รายละเอียดผู้รับสภาพหนี้แทน'} 
                      handleChange={(val) => handleChange('message', val)} 
                      containerClassname={'mb-3'} value={editDetail.message}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'รหัสองค์กร'} 
                      handleChange={(val) => handleChange('borrower_organization_code', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_organization_code}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'สังกัดองค์กรชื่อ'} 
                      handleChange={(val) => handleChange('borrower_organization_name', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_organization_name}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'คำนำหน้า'} 
                      handleChange={(val) => handleChange('borrower_name_prefix', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_name_prefix}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'ชื่อ'} 
                      handleChange={(val) => handleChange('borrower_firstname', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_firstname}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'นามสกุล'} 
                      handleChange={(val) => handleChange('borrower_lastname', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_lastname}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <DatePicker title={'วันเดือนปีเกิด'}
                      value={editDetail.borrower_birthday} 
                      handleChange={(val) => handleChange('borrower_birthday', val)} 
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'บ้านเลขที่'} 
                      handleChange={(val) => handleChange('borrower_house_no', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_house_no}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'หมู่ที่'} 
                      handleChange={(val) => handleChange('borrower_village_name', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_village_name}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'ซอย'} 
                      handleChange={(val) => handleChange('borrower_soi', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_soi}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'ถนน'} 
                      handleChange={(val) => handleChange('borrower_road', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_road}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'ตำบล/แขวง'} 
                      handleChange={(val) => handleChange('borrower_sub_district', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_sub_district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'} 
                      handleChange={(val) => handleChange('borrower_district', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    {provinces && (
                      <div className="form-floating form-floating-advance-select mb-3">
                        <label>จังหวัด</label>
                        <select className="form-select" value={editDetail.borrower_province ?? provinces[0]} onChange={(e) => handleChange('borrower_province', e.target?.value)}>
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
                      handleChange={(val) => handleChange('borrower_zipcode', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_zipcode}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'เบอร์โทรศัพท์'} 
                      handleChange={(val) => handleChange('borrower_mobile', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_mobile}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4">
                    <Textbox title={'อีเมล'} 
                      handleChange={(val) => handleChange('borrower_email', val)} 
                      containerClassname={'mb-3'} value={editDetail.borrower_email}
                    />
                  </div>
                </div>  
                <br />
                <div className="d-flex justify-content-center ">
                  <button className="btn btn-success" type="button" onClick={() => submitBorrower()}>บันทึก</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
export default FullModal;