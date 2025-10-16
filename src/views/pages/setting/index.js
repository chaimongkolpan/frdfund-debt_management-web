import { useEffect, useState } from "react";
import { getUserData } from "@utils";
import Textbox from "@views/components/input/Textbox";
import According from "@views/components/panel/according";
import UserTable from "@views/components/setting/userTable";
import NplTable from "@views/components/setting/nplTable";
import CustomModal from "@views/components/modal/customModal";
import { 
  getUsers,
  getNplCondition,
  getConstProvince,
  updateConstProvince,
  cleanData
} from "@services/api";

const user = getUserData();
const Setting = () => {
  const [data, setData] = useState(null);
  const [npl, setNpl] = useState(null);
  const [provinces, setProvinces] = useState(null);
  const [province, setProvince] = useState(null);
  const [isAddUser, setAddUser] = useState(null);
  const [isAddNpl, setAddNpl] = useState(null);
  const [isUpdateProvince, setUpdateProvince] = useState(false);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: process.env.VITE_PAGESIZE,
  });
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
  useEffect(() => {
    fetchData(filter)
    return cleanData
  },[])
  return (
    <>
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
                            onClick={() => setAddUser(true)}
                          >
                            <span className="fas fa-plus"></span>{" "}
                            เพิ่มผู้ใช้งาน
                          </button>
                        </div>
                      </div>
                      <UserTable result={data} getData={fetchData} filter={filter} />
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
        <CustomModal isOpen={isAddUser} setModal={setAddUser} 
          title={'เพิ่มผู้ใช้งาน'} 
          onClose={() => setAddUser(false)} closeText={'ยกเลิก'} 
          onOk={() => submitSplit(id_split)} okText={'บันทึก'}
        >
          <p className="text-body-tertiary lh-lg mb-0">ต้องการแยกสัญญา NPL (เลขที่สัญญา ) </p>
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