import { useEffect, useState, useRef } from "react";
import { ToDateDb } from "@utils";
import { 
  getProvinces,
  getLegalSpouses,
  saveLegalSpouses,
  removeLegalSpouses,
} from "@services/api";
import Textbox from "@views/components/input/Textbox";
import DatePicker from "@views/components/input/DatePicker";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const Spouse = (props) => {
  const { policy, isView } = props;
  const spouseRef = useRef(null);
  const [isMounted, setMounted] = useState(false);
  const [pSpouse, setPSpouse] = useState(null);
  const [spouses, setSpouses] = useState(null);
  const [debtor, setDebtor] = useState(null);
  const [guarantors, setGuarantors] = useState(null);
  const [spouseDetail, setSpouseDetail] = useState(null);
  const [isOpenSpouseAdd, setOpenSpouseAdd] = useState(false);
  const [isOpenSpouseEdit, setOpenSpouseEdit] = useState(false);
  const [provinces, setProvOp] = useState(null);
  const addSpouse = async() => {
    await setSpouseDetail({
      p_spouses: 'ผู้กู้',
      p_spouses_name: '',
      marital_status: 'โสด'
    })
    await setOpenSpouseAdd(true)
    await setOpenSpouseEdit(true)
    if (spouseRef.current) {
      spouseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const editSpouse = async(item) => {
    await setSpouseDetail(item)
    await setOpenSpouseAdd(false)
    await setOpenSpouseEdit(true)
    if (spouseRef.current) {
      spouseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const saveSpouse = async() => {
    const result = await saveLegalSpouses({ 
      ...spouseDetail, 
      id_KFKPolicy: policy.id_KFKPolicy,
      policyNO: policy.policyNO,
      spouses_birthday: ToDateDb(spouseDetail?.spouses_birthday)
    });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await fetchData();
      await setOpenSpouseAdd(false)
      await setOpenSpouseEdit(false)
      await setSpouseDetail(null)
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const removeSpouse = async(item) => {
    const result = await removeLegalSpouses(item);
    if (result.isSuccess) {
      await fetchData();
      await setOpenSpouseAdd(false)
      await setOpenSpouseEdit(false)
      await setSpouseDetail(null)
    }
  }
  const handleChangeSpouse = async (key, val) => {
    await setSpouseDetail((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const fetchData = async () => {
    const result = await getLegalSpouses(policy.id_KFKPolicy);
    if (result.isSuccess) {
      await setSpouses(result.data)
      await setDebtor(result.debtor);
      await setGuarantors(result.guarantors);
    } else {
      await setSpouses(null)
      await setDebtor([]);
      await setGuarantors([]);
    }
  }
  const getSpouseName = async () => {
    if (spouseDetail?.p_spouses != 'ผู้กู้' && debtor && debtor?.length > 0) {
      await setSpouseDetail((prevState) => ({
        ...prevState,
      ...({p_spouses_name: debtor[0]})
      }))
    } else if(guarantors && guarantors?.length > 0) {
      await setSpouseDetail((prevState) => ({
        ...prevState,
      ...({p_spouses_name: guarantors[0]})
      }))
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
  useEffect(() => {
    if (spouseDetail?.p_spouses != 'เจ้าของหลักประกัน') {
      getSpouseName();
    } else {
      setSpouseDetail((prevState) => ({
        ...prevState,
        ...({p_spouses_name: ''})
      }))
    }
  },[spouseDetail?.p_spouses])
  useEffect(() => {},[spouseRef]);
  useEffect(() => {
    if (!isMounted) {
      fetchData();
      getProvince();
    }
  },[])
  return (
    <>
      <div className={`d-flex mb-3 flex-row-reverse ${isView ? 'd-none' : ''}`}>
        <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => addSpouse()}><span className="fas fa-plus fs-8"></span> เพิ่มข้อมูลคู่สมรส</button>
      </div>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"],"page":10,"pagination":true}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
              <tr>
              <th>#</th>
                <th>ข้อมูลของ</th>
                <th>ชื่อ-นามสกุล</th>
                <th>สถานะสมรส</th>
                <th>เลขบัตรประชาชนคู่สมรส</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                {isView ? (
                  <th>ดูข้อมูล</th>
                ) : (
                  <>
                    <th>แก้ไขข้อมูล</th>
                    <th>ลบข้อมูล</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(spouses && spouses.length > 0) ? (spouses.map((item,index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td>{item.p_spouses}</td>
                  <td>{item.p_spouses_name}</td>
                  <td>{item.marital_status}</td>
                  <td>{item.spouses_idcard}</td>
                  <td>{item.spouses_name_prefix}</td>
                  <td>{item.spouses_firstname + ' ' + item.spouses_lastname}</td>
                  {isView ? (
                    <td>
                      <div className='d-flex justify-content-center'>
                        <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editSpouse(item)}>
                          <i className="far fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td>
                        <div className='d-flex justify-content-center'>
                          <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => editSpouse(item)}>
                            <i className="far fa-edit"></i>
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-center'>
                          <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger-dark px-0" type='button' onClick={() => editSpouse(item)}>
                            <i className="far fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={9}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      {isOpenSpouseEdit && (
        <div ref={spouseRef} className="mb-1">
          <div className="card shadow-none border my-4" data-component-card="data-component-card">
            <div className="card-body p-0">
              <div className="p-4 code-to-copy">
                <div className="row g-3">
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-floating needs-validation">
                      <select className="form-select" disabled={isView} value={spouseDetail?.p_spouses ?? 'ผู้กู้'} onChange={(e) => handleChangeSpouse('p_spouses', e.target?.value)}>
                        <option value="ผู้กู้" selected>ผู้กู้</option>
                        <option value="ผู้ค้ำ">ผู้ค้ำ</option>
                        <option value="เจ้าของหลักประกัน">เจ้าของหลักประกัน</option>
                      </select>
                      <label htmlFor="floatingSelectTeam">ข้อมูลของ</label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    {spouseDetail?.p_spouses == 'เจ้าของหลักประกัน' ? (
                      <Textbox title={'ชื่อ-นามสกุล'}  disabled={isView}
                        handleChange={(val) => handleChangeSpouse('p_spouses_name', val)} 
                        containerClassname={'mb-3'} value={spouseDetail?.p_spouses_name}
                      />
                    ) : (
                      <div className="form-floating needs-validation">
                        <select className="form-select" disabled={isView} value={spouseDetail?.p_spouses_name ?? ''} onChange={(e) => handleChangeSpouse('p_spouses_name', e.target?.value)}>
                          {spouseDetail?.p_spouses == 'ผู้กู้' ? (
                            debtor && debtor.map(item => (
                              <option>{item}</option>
                            ))
                          ) : (
                            guarantors && guarantors.map(item => (
                              <option>{item}</option>
                            ))
                          )}
                        </select>
                        <label htmlFor="floatingSelectTeam">ชื่อ-นามสกุล</label>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-floating needs-validation">
                      <select className="form-select" disabled={isView} value={spouseDetail?.marital_status ?? 'โสด'} onChange={(e) => handleChangeSpouse('marital_status', e.target?.value)}>
                        <option value="โสด" selected>โสด</option>
                        <option value="สมรส">สมรส</option>
                        <option value="หย่าร้าง">หย่าร้าง</option>
                        <option value="เสียชีวิต">เสียชีวิต</option>
                      </select>
                      <label htmlFor="floatingSelectTeam">สถานะสมรส</label>
                    </div>
                  </div>
                  <div className="mb-1">
                    <div className="card shadow-none border my-4" data-component-card="data-component-card">
                      <div className="card-body p-0">
                        <div className="p-4 code-to-copy">
                          <h3 className="text-center">รายละเอียดคู่สมรส</h3>
                          <br />
                          <div className="row g-3">
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'เลขบัตรประชาชน'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_idcard', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_idcard}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'คำนำหน้า'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_name_prefix', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_name_prefix}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ชื่อ'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_firstname', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_firstname}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'นามสกุล'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_lastname', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_lastname}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <DatePicker title={'วันเดือนปีเกิด'} disabled={isView}
                                value={spouseDetail?.spouses_birthday} 
                                handleChange={(val) => handleChangeSpouse('spouses_birthday', val)} 
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'เชื้อชาติ'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_ethnicity', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_ethnicity}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'สัญชาติ'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_nationality', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_nationality}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'บ้านเลขที่'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_house_no', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_house_no}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'บ้าน/ชุมชน'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_village_name', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_village_name}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ซอย'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_soi', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_soi}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ถนน'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_road', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_road}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'ตำบล/แขวง'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_sub_district', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_sub_district}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <Textbox title={'อำเภอ/กิ่งอำเภอ/เขต'}  disabled={isView}
                                handleChange={(val) => handleChangeSpouse('spouses_district', val)} 
                                containerClassname={'mb-3'} value={spouseDetail?.spouses_district}
                              />
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-4">
                              <div className="form-floating form-floating-advance-select mb-3">
                                <label>จังหวัด</label>
                                <select className="form-select" disabled={isView} value={spouseDetail?.spouses_province ?? provinces[0]} onChange={(e) => handleChangeSpouse('spouses_province', e.target?.value)}>
                                  {provinces && (
                                    provinces.map((option, index) => (
                                      <option key={index} value={option}>{option}</option>
                                    ))
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>  
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`d-flex justify-content-center ${isView ? 'd-none' : ''}`}>
                <button className="btn btn-success me-2" type="button" onClick={() => saveSpouse()}>บันทึก</button>
                {isOpenSpouseAdd ? (
                  <button className="btn btn-secondary" type="button" onClick={() => setOpenSpouseEdit(false)}>ยกเลิก</button>
                ) : (
                  <button className="btn btn-danger" type="button" onClick={() => removeSpouse(spouseDetail)}>ลบข้อมูลคู่สมรส</button>
                )}
              </div>
              <br />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Spouse;