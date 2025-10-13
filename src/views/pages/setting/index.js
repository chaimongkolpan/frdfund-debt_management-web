import { useEffect, useState } from "react";
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import UserTable from "@views/components/setting/userTable";
import NplTable from "@views/components/setting/nplTable";
import CustomModal from "@views/components/modal/customModal";
import { 
  getUsers,
  getNplCondition,
  cleanData
} from "@services/api";

const user = getUserData();
const Setting = () => {
  const [data, setData] = useState(null);
  const [npl, setNpl] = useState(null);
  const [isAddUser, setAddUser] = useState(null);
  const [isAddNpl, setAddNpl] = useState(null);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: process.env.VITE_.PAGESIZE,
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
    </>
  );
};
export default Setting;