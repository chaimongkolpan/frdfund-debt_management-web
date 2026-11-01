import { useEffect, useState } from "react";
import { getUserData } from "@utils";
import Textbox from "@views/components/input/Textbox";
import According from "@views/components/panel/according";
import UserTable from "@views/components/setting/userTable";
import NplTable from "@views/components/setting/nplTable";
import CustomModal from "@views/components/modal/customModal";
import DeleteModal from "@views/components/modal/customModal";
import { 
  getUsers,
  addUsers,
  updateUsers,
  deleteUsers,
  getNplCondition,
  getConstProvince,
  updateConstProvince,
  getAllProvinces,
  cleanData
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const Setting = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [npl, setNpl] = useState(null);
  const [provinces, setProvinces] = useState(null);
  const [province, setProvince] = useState(null);
  const [isAddUser, setAddUser] = useState(null);
  const [isOpenDelete, setShowDelete] = useState(false);
  const [isOpenEdit, setShowEdit] = useState(false);
  const [isAddNpl, setAddNpl] = useState(null);
  const [isUpdateProvince, setUpdateProvince] = useState(false);
  const [provincesOp, setProvOp] = useState(null);
  const [provincesMaster, setProvMaster] = useState(null);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: process.env.VITE_PAGESIZE,
  });
  const getProvince = async () => {
    const resultProv = await getAllProvinces();
    if (resultProv.isSuccess) {
      await setProvMaster(resultProv.data);
      const temp = resultProv.data.map(item => item.name);
      await setProvOp(temp);
    } else {
      await setProvOp(null);
    }
  }
  const fetchData = async (filter) => {
    const result = await getUsers(filter);
    if (result.isSuccess) {
      await setData(result);
    }
    const resultNpl = await getNplCondition();
    if (resultNpl.isSuccess) {
      await setNpl(resultNpl);
    }
    const resultProvince = await getConstProvince();
    if (resultProvince.isSuccess) {
      await setProvinces(resultProvince.data);
    }
  }
  const handleAddUser = async () => {
    const newuser = {
      ...user,
      password: '',
      province_id: provincesMaster.find(item => item.name === user?.province)?.id
    }
    const result = await addUsers(newuser);
    if (result.isSuccess) {
      await setAddUser(false)
      await setUser(null)
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleEditUser = async (item) => {
    await setUser(item);
    await setShowEdit(true);
  }
  const editUser = async () => {
    const newuser = {
      ...user,
      password: '',
      province_id: provincesMaster.find(item => item.name === user?.province)?.id
    }
    const result = await updateUsers(newuser);
    if (result.isSuccess) {
      await setShowEdit(false)
      await setUser(null)
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const handleDeleteUser = async (item) => {
    await setUser(item);
    await setShowDelete(true);
  }
  const deleteUser = async () => {
    const result = await deleteUsers({ id: user?.id });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'ลบสำเร็จ'} />
      ));
      await setShowDelete(false);
      await setUser(null)
      await fetchData();
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'ลบไม่สำเร็จ'} />
      ));
    }
  }
  const onEdit = (item) => {
    setProvince(item);
    setUpdateProvince(true);
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.province_name}</td>
        <td>{item.branch_name}</td>
        <td>{item.branch_address}</td>
        <td>{item.branch_tel}</td>
        <td>{item.manager}</td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-warning btn-icon fs-7 px-0 me-2" onClick={() => onEdit(item)}><i className="far fa-edit"></i></button>
          </div>
        </td>
      </tr>
    ))
  }
  const submitProvince = async () => {
    const resultUpdateProvince = await updateConstProvince(province);
    if (resultUpdateProvince.isSuccess) {
      const resultProvince = await getConstProvince();
      if (resultProvince.isSuccess) {
        await setProvinces(resultProvince.data);
      }
      setUpdateProvince(false);
    }
  }
  const handleChange = async (key, val) => {
    await setUser((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  useEffect(() => {
    getProvince();
    fetchData(filter)
    return cleanData
  },[])
  return (
    <>
      {isOpenDelete && (
        <DeleteModal isOpen={isOpenDelete} setModal={setShowDelete} 
          title={'ลบผู้ใช้งาน'} 
          onClose={() => setShowDelete(false)} closeText={'ยกเลิก'}
          onOk={() => deleteUser()} okText={'ลบ'} okColor={'danger'}
          scrollable={true}
        >{'คุณยืนยันที่จะลบผู้ใช้งานนี้ใช่หรือไม่?'}</DeleteModal>
      )}
      <div className="content">
        <h4 className="mb-3">ตั้งค่าระบบ</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'จัดการผู้ใช้งาน'}
                  className={"my-4"}
                  children={(
                    <>
                      <div className="d-flex flex-row-reverse mb-3">
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm ms-2"
                            onClick={async () => {
                              await setUser(null)
                              await setAddUser(true);
                            }}
                          >
                            <span className="fas fa-plus"></span>{" "}
                            เพิ่มผู้ใช้งาน
                          </button>
                        </div>
                      </div>
                      <UserTable result={data} getData={fetchData} filter={filter} onRemove={handleDeleteUser} onEdit={handleEditUser} />
                    </>
                  )}
                />
                <According 
                  title={'ตั้งค่าระบบ'}
                  className={"my-4"}
                  children={(
                    <>
                      <div className="d-flex flex-row-reverse mb-3">
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm ms-2"
                            onClick={() => setAddNpl(true)}
                          >
                            <span className="fas fa-plus"></span>{" "}
                            เพิ่มเงื่อนไข NPL
                          </button>
                        </div>
                      </div>
                      <NplTable result={npl} />
                    </>
                  )}
                />
                <According 
                  title={'ตั้งค่าที่อยู่'}
                  className={"my-4"}
                  children={(
                    <>
                      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
                        <div className="table-responsive mx-n1 px-1">
                          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                              <tr>
                                <th style={{ width: 30 }}>#</th>
                                <th>ชื่อจังหวัด</th>
                                <th>ชื่อสาขา</th>
                                <th>ที่อยู่</th>
                                <th style={{ width: 100 }}>เบอร์โทร</th>
                                <th style={{ width: 200 }}>ผู้จัดการ</th>
                                <th style={{ width: 50 }}></th>
                              </tr>
                            </thead>
                            <tbody className="list text-center align-middle" id="bulk-select-body">
                              {(provinces && provinces.length > 0) ? (provinces.map((item,index) => RenderData(item, index))) : (
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
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddUser && (
        <CustomModal isOpen={isAddUser} setModal={setAddUser} scrollable size={'xl'}
          title={'เพิ่มผู้ใช้งาน'} 
          onClose={() => setAddUser(false)} closeText={'ยกเลิก'} 
          onOk={() => handleAddUser()} okText={'บันทึก'}
        >
          <div className="row g-3">
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ชื่อผู้ใช้งาน'} handleChange={(val) => handleChange('username', val)} 
                containerClassname={'mb-3'} value={user?.username}
              />
            </div>
            <div className="col-sm-12  col-md-6">

              {/* <Textbox title={'รหัสผ่าน'} handleChange={(val) => handleChange('password', val)} 
                containerClassname={'mb-3'} value={user?.password}
              /> */}

            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ชื่อ'} handleChange={(val) => handleChange('firstname', val)} 
                containerClassname={'mb-3'} value={user?.firstname}
              />
            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'นามสกุล'} handleChange={(val) => handleChange('lastname', val)} 
                containerClassname={'mb-3'} value={user?.lastname}
              />
            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ตำแหน่ง'} handleChange={(val) => handleChange('position', val)} 
                containerClassname={'mb-3'} value={user?.position}
              />
            </div>
            <div className="col-sm-6 col-md-6">
              <div className="form-floating form-floating-advance-select mb-3">
                <label htmlFor="floatingSelectPrivacy">สิทธิ์การเข้าใช้งาน</label>
                <select className={`form-select`} value={user?.role ?? '4'} onChange={(e) => handleChange('role', e.target?.value)}>
                  <option value="2">สำนักหนี้</option>
                  <option value="3">การเงิน / บัญชี</option>
                  <option value="4">สาขาจังหวัด</option>
                  <option value="5">บริหารสินทรัพย์</option>
                  <option value="6">ปรับปรุงโครงสร้างหนี้</option>
                  <option value="7">จัดการหนี้1</option>
                  <option value="8">จัดการหนี้2</option>
                  <option value="9">จัดการหนี้3</option>
                  <option value="10">สำนักตรวจสอบ</option>
                  <option value="11">สำนักงานกิจการสาขาภูมิภาค1 (เหนือ)</option>
                  <option value="12">สำนักงานกิจการสาขาภูมิภาค2 (กลาง)</option>
                  <option value="13">สำนักงานกิจการสาขาภูมิภาค3 (ตะวันออกเฉียงเหนือ)</option>
                  <option value="13">สำนักงานกิจการสาขาภูมิภาค3 (อีสาน)</option>
                  <option value="14">สำนักงานกิจการสาขาภูมิภาค4 (ใต้)</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              {provincesOp && (
                <div className="form-floating form-floating-advance-select mb-3">
                  <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                  <select className="form-select" value={user?.province ?? provincesOp[0]} onChange={(e) => handleChange('province', e.target?.value)}>
                      {provincesOp.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </CustomModal>
      )}
      {isOpenEdit && (
        <CustomModal isOpen={isOpenEdit} setModal={setShowEdit} scrollable size={'xl'}
          title={'แก้ไขผู้ใช้งาน'} 
          onClose={() => setShowEdit(false)} closeText={'ยกเลิก'} 
          onOk={() => editUser()} okText={'บันทึก'}
        >
          <div className="row g-3">
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ชื่อผู้ใช้งาน'} handleChange={(val) => handleChange('username', val)} 
                containerClassname={'mb-3'} value={user?.username} disabled
              />
            </div>
            <div className="col-sm-12  col-md-6">

              {/* <Textbox title={'รหัสผ่าน'} handleChange={(val) => handleChange('password', val)} 
                containerClassname={'mb-3'} value={user?.password}
              /> */}

            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ชื่อ'} handleChange={(val) => handleChange('firstname', val)} 
                containerClassname={'mb-3'} value={user?.firstname}
              />
            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'นามสกุล'} handleChange={(val) => handleChange('lastname', val)} 
                containerClassname={'mb-3'} value={user?.lastname}
              />
            </div>
            <div className="col-sm-12  col-md-6">
              <Textbox title={'ตำแหน่ง'} handleChange={(val) => handleChange('position', val)} 
                containerClassname={'mb-3'} value={user?.position}
              />
            </div>
            <div className="col-sm-6 col-md-6">
              <div className="form-floating form-floating-advance-select mb-3">
                <label htmlFor="floatingSelectPrivacy">สิทธิ์การเข้าใช้งาน</label>
                <select className={`form-select`} value={user?.role ?? '4'} onChange={(e) => handleChange('role', e.target?.value)}>
                  <option value="2">สำนักหนี้</option>
                  <option value="3">การเงิน / บัญชี</option>
                  <option value="4">สาขาจังหวัด</option>
                  <option value="5">บริหารสินทรัพย์</option>
                  <option value="6">ปรับปรุงโครงสร้างหนี้</option>
                  <option value="7">จัดการหนี้1</option>
                  <option value="8">จัดการหนี้2</option>
                  <option value="9">จัดการหนี้3</option>
                  <option value="10">สำนักตรวจสอบ</option>
                  <option value="11">สำนักงานกิจการสาขาภูมิภาค1 (เหนือ)</option>
                  <option value="12">สำนักงานกิจการสาขาภูมิภาค2 (กลาง)</option>
                  <option value="13">สำนักงานกิจการสาขาภูมิภาค3 (ตะวันออกเฉียงเหนือ)</option>
                  <option value="13">สำนักงานกิจการสาขาภูมิภาค3 (อีสาน)</option>
                  <option value="14">สำนักงานกิจการสาขาภูมิภาค4 (ใต้)</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              {provincesOp && (
                <div className="form-floating form-floating-advance-select mb-3">
                  <label htmlFor="floaTingLabelSingleSelect">จังหวัด</label>
                  <select className="form-select" value={user?.province ?? provincesOp[0]} onChange={(e) => handleChange('province', e.target?.value)}>
                      {provincesOp.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </CustomModal>
      )}
      {isAddNpl && (
        <CustomModal isOpen={isAddNpl} setModal={setAddNpl} 
          title={'เพิ่มเงื่อนไข NPL'} 
          onClose={() => setAddNpl(false)} closeText={'ยกเลิก'} 
          onOk={() => submitSplit(id_split)} okText={'บันทึก'}
        >
          <p className="text-body-tertiary lh-lg mb-0">ต้องการแยกสัญญา NPL (เลขที่สัญญา ) </p>
        </CustomModal>
      )}
      {isUpdateProvince && (
        <CustomModal isOpen={isUpdateProvince} setModal={setUpdateProvince} 
          title={'แก้ไขรายละเอียดจังหวัด'} size={'xl'}
          onClose={() => setUpdateProvince(false)} closeText={'ยกเลิก'} 
          onOk={() => submitProvince()} okText={'บันทึก'}
        >
          <div className="row g-3">
            <div className="col-12">
              <Textbox title={'ชื่อจังหวัด'} disabled={true}
                handleChange={(val) => setProvince((prev) => ({ ...prev, province_name: val }))} 
                containerClassname={'mb-3'} value={province?.province_name}
              />
            </div>
            <div className="col-12">
              <Textbox title={'ชื่อสาขา'}
                handleChange={(val) => setProvince((prev) => ({ ...prev, branch_name: val }))} 
                containerClassname={'mb-3'} value={province?.branch_name}
              />
            </div>
            <div className="col-12">
              <Textbox title={'ที่อยู่'}
                handleChange={(val) => setProvince((prev) => ({ ...prev, branch_address: val }))} 
                containerClassname={'mb-3'} value={province?.branch_address}
              />
            </div>
            <div className="col-12">
              <Textbox title={'เบอร์โทร'}
                handleChange={(val) => setProvince((prev) => ({ ...prev, branch_tel: val }))} 
                containerClassname={'mb-3'} value={province?.branch_tel}
              />
            </div>
            <div className="col-12">
              <Textbox title={'ผู้จัดการ'}
                handleChange={(val) => setProvince((prev) => ({ ...prev, manager: val }))} 
                containerClassname={'mb-3'} value={province?.manager}
              />
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
};
export default Setting;