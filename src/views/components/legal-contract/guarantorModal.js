import { useEffect, useState, useRef } from "react";
import { ToDateDb } from "@utils";
import { 
  getProvinces,
  getLegalGuarantor,
  updateLegalGuarantor,
} from "@services/api";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";

const Guarantor = (props) => {
  const { policy, isView } = props;
  const guarantorRef = useRef(null);
  const [isMounted, setMounted] = useState(false);
  const [guarantors, setGuarantors] = useState(null);
  const [guarantorDetail, setGuarantorDetail] = useState(null);
  const [isOpenGuarantorEdit, setOpenGuarantorEdit] = useState(false);
  const [provinces, setProvOp] = useState(null);
  const editGuarantor = async(item) => {
    await setGuarantorDetail(item)
    await setOpenGuarantorEdit(true)
    if (guarantorRef.current) {
      guarantorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const saveGuarantor = async() => {
    const result = await updateLegalGuarantor({ 
      ...guarantorDetail, 
      id_KFKPolicy: policy.id_KFKPolicy,
      policyNO: policy.policyNO,
      guarantor_birthday: ToDateDb(guarantorDetail.guarantor_birthday)
    });
    if (result.isSuccess) {
      await fetchData();
      await setOpenGuarantorEdit(false)
      await setGuarantorDetail(null)
    }
  }
  const handleChangeGuarantor = async (key, val) => {
    await setGuarantorDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const fetchData = async () => {
    const result = await getLegalGuarantor(policy.id_KFKPolicy);
    if (result.isSuccess) {
      const len = result.guarantors.length;
      await setGuarantors([
        ...result.guarantors,
        ...((len < 1) ? [{ guarantor_type: 'ทายาทเกษตรกรสมาชิก' }] : []),
        ...((len < 2) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 100000 && len < 3) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 200000 && len < 4) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
        ...((policy.loan_amount >= 500000 && len < 5) ? [{ guarantor_type: 'สมาชิกองค์กรเกษตรกร' }] : []),
      ])
    } else {
      await setGuarantors(null)
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
    await setMounted(true);
  }
  useEffect(() => {},[guarantorRef]);
  useEffect(() => {
    if (!isMounted) {
      fetchData();
      getProvince();
    }
  },[])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
              <tr>
              <th>#</th>
                <th>ประเภทบุคคลค้ำประกัน</th>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                {isView ? (
                  <th>ดูข้อมูล</th>
                ) : (
                  <th>แก้ไขข้อมูล</th>
                )}
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(guarantors && guarantors.length > 0) ? (guarantors.map((item,index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td>{item.guarantor_type}</td>
                  <td>{item.guarantor_idcard}</td>
                  <td>{item.guarantor_name_prefix}</td>
                  <td>{item.fullname}</td>
                  <td>
                    <div className='d-flex justify-content-center'>
                      <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editGuarantor(item)} disabled={!guarantors[0].guarantor_idcard && index > 0 && !isView}>
                        <i className={`far fa-${isView? 'eye' : 'edit'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={6}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      {isOpenGuarantorEdit && (
        <div ref={guarantorRef} className="mb-1">
          <div className="card shadow-none border my-4" data-component-card="data-component-card">
            <div className="card-body p-0">
              <div className="p-4 code-to-copy">
                <h3 className="text-center">รายละเอียดบุคคลค้ำประกัน</h3>
                <br />
                <div className="row g-3">
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'ประเภทบุคคลค้ำประกัน'} disabled
                      handleChange={(val) => handleChangeGuarantor('guarantor_type', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_type}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'เลขบัตรประชาชน'} disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_idcard', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_idcard}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'คำนำหน้า'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_name_prefix', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_name_prefix}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'ชื่อ'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_firstname', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_firstname}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'นามสกุล'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_lastname', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_lastname}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <DatePicker title={'วันเดือนปีเกิด'} disabled={isView}
                      value={guarantorDetail.guarantor_birthday} 
                      handleChange={(val) => handleChangeGuarantor('guarantor_birthday', val)} 
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'บ้านเลขที่'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_house_no', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_house_no}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'บ้าน/ชุมชน'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_village_name', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_village_name}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'ซอย'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_soi', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_soi}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'ถนน'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_road', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_road}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'ตำบล/แขวง'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_sub_district', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_sub_district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_district', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_district}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-floating form-floating-advance-select mb-3">
                      <label>จังหวัด</label>
                      <select className="form-select" disabled={isView} value={guarantorDetail.guarantor_province ?? provinces[0]} onChange={(e) => handleChangeGuarantor('guarantor_province', e.target?.value)}>
                        {provinces && (
                          provinces.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'รหัสไปรษณีย์'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_zipcode', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_zipcode}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'เบอร์โทรศัพท์'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_mobile', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_mobile}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <Textbox title={'อีเมล'}  disabled={isView}
                      handleChange={(val) => handleChangeGuarantor('guarantor_email', val)} 
                      containerClassname={'mb-3'} value={guarantorDetail.guarantor_email}
                    />
                  </div>
                </div>  
                </div>
                <div className={`d-flex justify-content-center ${isView ? 'd-none' : ''}`}>
                  <button className="btn btn-success me-2" type="button" onClick={() => saveGuarantor()}>บันทึก</button>
                  <button className="btn btn-secondary" type="button" onClick={() => setOpenGuarantorEdit(false)}>ยกเลิก</button>
                </div>
                <br />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Guarantor;