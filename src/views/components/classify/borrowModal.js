import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Textbox from "@views/components/input/Textbox";
import Dropdown from "@views/components/input/DropdownSearch";
import DatePicker from "@views/components/input/DatePicker";
import { 
  getProvinces,
  getBorrowerClassify,
  updateBorrowerClassify,
} from "@services/api";
const FullModal = (props) => {
  const {isOpen, setModal, onClose, idcard, province, creditorType, ids, debtManagementType = "NPL", can_action } = props;
  const [isMounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [provinces, setProvOp] = useState(null);
  const [selectedType, setSelectedType] = useState('ผู้กู้');
  const [editDetail, setEditDetail] = useState(null);
  const [hasBorrower, setHasBorrower] = useState(false);
  const [isOpenView, setOpenView] = useState(false);
  const [isOpenEdit, setOpenEdit] = useState(false);
  const toggle = () => setModal(!isOpen);
  const viewData = (item) => {
    setEditDetail(item);
    setOpenView(true);
    setOpenEdit(false);
    setSelectedType("ผู้กู้");
  }
  const editData = async (item) => {
    await setEditDetail(null);
    await setOpenView(false);
    await setOpenEdit(false);
    await setEditDetail(item);
    await setOpenEdit(true);
    await setSelectedType("ผู้รับสภาพหนี้");
  }
  const addData = async () => {
    await setEditDetail({ id_card: idcard,province: province,creditor_type: creditorType });
    await setOpenView(false);
    await setOpenEdit(true);
    await setSelectedType("ผู้รับสภาพหนี้");
  }
  const onTypeChange = (type) => {
    setSelectedType(type)
    if (type == 'ผู้กู้') {
      if (data && data.length > 0) {
        var item = data.find(x => x.borrower_status == 'ผู้กู้');
        setEditDetail(item);
      }
      setOpenView(false);
      setOpenEdit(false);
    } else {
      if (data && data.length > 0) {
        var item = data.filter(x => x.borrower_status != 'ผู้กู้');
        setEditDetail(item[item.length - 1]);
      }
      setOpenView(false);
      setOpenEdit(false);
    }
  }
  const handleChange = async (key, val) => {
    await setEditDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const submitBorrower = async() => {
    const id = ids && ids?.length > 0 ? ids[0] : 0;
    const result = await updateBorrowerClassify({ ...editDetail, ids: [id] });
    if (result.isSuccess) {
      await fetchData();
    }
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index} style={{ ...(item.is_active && ({backgroundColor: "#c2f9fc"})) }}>
        <td>{index + 1}</td>
        <td>{item.borrower_status}</td>
        <td>{item.borrower_idcard}</td>
        <td>{item.borrower_name_prefix}</td>
        <td>{item.borrower_firstname + ' ' + item.borrower_lastname}</td>
        <td>{item.borrower_mobile}</td>
        <td>
          <div className="d-flex justify-content-center"> 
            {(item.borrower_status == 'ผู้กู้') ? (
              <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => viewData(item)}><i className="fas fa-eye"></i></button>
            ) : (
              !item.is_active ? (
                <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => viewData(item)}><i className="fas fa-eye"></i></button>
              ) : (
                !can_action ? (
                  <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => viewData(item)}><i className="fas fa-eye"></i></button>
                ) : (
                  <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editData(item)}><i className="far fa-edit"></i></button>
                )
              )
            )}
          </div>
        </td>
      </tr>
    ))
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
    const result = await getBorrowerClassify(idcard, province, creditorType, debtManagementType);
    if (result.isSuccess) {
      setData(result.borrowers);
      var item = result.borrowers.find(x => x.is_active);
      if (item) {
        setEditDetail(item);
        onTypeChange(item.borrower_status);
      }
      var Ack = result.borrowers.filter(x => x.borrower_status != 'ผู้กู้');
      setHasBorrower(Ack.length > 0)
    } else {
      setData(null)
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
      <Modal isOpen={isOpen} toggle={toggle} scrollable fullscreen>
        <ModalHeader toggle={toggle}>ผู้รับสภาพหนี้แทน</ModalHeader>
        <ModalBody>
          <form>
            {can_action && (
              <div className="d-flex mb-3 flex-row-reverse">
                <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addData()}>
                  <span className="fas fa-plus fs-8"></span> เพิ่มผู้รับสภาพหนี้แทน
                </button>
              </div>
            )}
            <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-bordered fs-9 mb-0">
                  <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
                    <tr>
                      <th style={{ minWidth: 30 }}>#</th>
                      <th>สถานะผู้กู้</th>
                      <th>เลขบัตรประชาชน</th>
                      <th>คำนำหน้า</th>
                      <th>ชื่อ-นามสกุล</th>
                      <th>เบอร์โทรศัพท์</th>
                      <th>ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="list text-center align-middle">
                    {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={7}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className="row d-none">
              <div className=" col-sm-12 col-md-6 col-lg-3">
                <div className=" input-group">
                  <select value={selectedType} className="form-select" onChange={(e) => onTypeChange(e.target?.value)}>
                    <option value="ผู้กู้">ผู้กู้</option>
                    <option value="ผู้รับสภาพหนี้">ผู้รับสภาพหนี้</option>
                    {/* hasBorrower && (
                    )*/ }
                  </select>
                </div>
              </div>
            </div>
            {(isOpenView && editDetail) && (
              <div className="mb-1">
                <div className="card shadow-none border my-4" data-component-card="data-component-card">
                  <div className="card-body p-0">
                    <div className="p-4 code-to-copy">
                      <h3 className="text-center">ผู้กู้</h3>
                      <br />
                      <div className="row g-3">
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เลขบัตรประชาชน'} 
                            handleChange={(val) => handleChange('borrower_idcard', editDetail.borrower_idcard)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_idcard}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'คำนำหน้า'} 
                            handleChange={(val) => handleChange('borrower_name_prefix', editDetail.borrower_name_prefix)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_name_prefix}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ชื่อ'} 
                            handleChange={(val) => handleChange('borrower_firstname', editDetail.borrower_firstname)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_firstname}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'นามสกุล'} 
                            handleChange={(val) => handleChange('borrower_lastname', editDetail.borrower_lastname)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_lastname}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'วันเดือนปีเกิด'} 
                            handleChange={(val) => handleChange('borrower_birthday', editDetail.borrower_birthday)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_birthday}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'บ้านเลขที่'} 
                            handleChange={(val) => handleChange('borrower_house_no', editDetail.borrower_house_no)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_house_no}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'หมู่ที่'} 
                            handleChange={(val) => handleChange('borrower_village_name', editDetail.borrower_village_name)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_village_name}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ซอย'} 
                            handleChange={(val) => handleChange('borrower_soi', editDetail.borrower_soi)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_soi}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ถนน'} 
                            handleChange={(val) => handleChange('borrower_road', editDetail.borrower_road)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_road}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'ตำบล/แขวง'} 
                            handleChange={(val) => handleChange('borrower_sub_district', editDetail.borrower_sub_district)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_sub_district}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'} 
                            handleChange={(val) => handleChange('borrower_district', editDetail.borrower_district)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_district}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'จังหวัด'} 
                            handleChange={(val) => handleChange('borrower_province', editDetail.borrower_province)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_province}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'รหัสไปรษณีย์'} 
                            handleChange={(val) => handleChange('borrower_zipcode', editDetail.borrower_zipcode)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_zipcode}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'เบอร์โทรศัพท์'} 
                            handleChange={(val) => handleChange('borrower_mobile', editDetail.borrower_mobile)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_mobile}
                            disabled 
                          />
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-4">
                          <Textbox title={'อีเมล'} 
                            handleChange={(val) => handleChange('borrower_email', editDetail.borrower_email)} 
                            containerClassname={'mb-3'} value={editDetail.borrower_email}
                            disabled 
                          />
                        </div>
                      </div> 
                      {/* <br />
                      <div className="d-flex justify-content-center ">
                        <button className="btn btn-success" type="button" onClick={() => submitBorrower()}>บันทึก</button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(isOpenEdit && editDetail) && (
              <div className="mb-1">
                <div className="card shadow-none border my-4" data-component-card="data-component-card">
                  <div className="card-body p-0">
                    <div className="p-4 code-to-copy">
                      <h3 className="text-center">ผู้รับสภาพหนี้แทน</h3>
                      <br />
                      <div className="row g-3">
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
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>ปิด</Button>
        </ModalFooter>
      </Modal>
  );
};
export default FullModal;