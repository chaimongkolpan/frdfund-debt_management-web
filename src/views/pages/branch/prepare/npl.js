import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@utils";
import { Spinner } from 'reactstrap'
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import AddModal from "@views/components/modal/CustomModal";
import Modal from "@views/components/modal/FullModal";
import According from "@views/components/panel/according";
import Filter from "@views/components/branch/filter";
import SearchTable from "@views/components/branch/searchTable";
import { 
  importClassify
} from "@services/api";

const user = getUserData();
const NPL = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [isIncorrectAdd, setIncorrectAdd] = useState(false);
  const [filter, setFilter] = useState(null);
  
  const onAddBigData = async (selected) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await addMakePetitionList(ids);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData({ ...filterAdded, currentPage: 1 });
    }
  }
  const onRemoveMakelist = async (selected) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await removeMakePetitionList(ids);
    if (result.isSuccess) {
      await fetchData(filterAdded)
    }
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const handleSubmit = async(selected) => {
    await setMakeList(selected);
    await setSubmit(true);
  }
  const onSubmitMakelist = async () => {
    if (addPetition) {
      const result = await exportPetition({ type: 'application/octet-stream', filename: 'จัดทำฎีกา_' + (new Date().getTime()) + '.zip', data: addPetition });
      if (result.isSuccess) {
      }
    } else {
      alert('กรุณาบันทึกฎืกาก่อน ดาวน์โหลดเอกสาร');
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatus: 'ยืนยันยอดสำเร็จ' })
    const result = await searchMakePetition(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  useEffect(() => {
  },[data])
  return (
    <>
      <div className="content">
        <h4>รวบรวมเตรียมนำเสนอขออนุมัติรายชื่อ NPL</h4>
        <div>
          <div className="row g-4">
            <div className="col-12 col-xl-12 order-1 order-xl-0">
              <div className="mb-9">
                <According 
                  title={'ค้นหา'}
                  className={"my-4"}
                  children={(
                    <>
                      <Filter handleSubmit={onSearch} setLoading={setLoadBigData} />
                      <br />
                      {data && (
                        <SearchTable result={data} handleSubmit={onAddBigData} filter={filter} getData={onSearch} />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenAdd && (
        <AddModal isOpen={isOpenAdd} setModal={setOpenAdd} 
          title={'รวบรวมเตรียมนำเสนอ'} 
          onClose={() => setOpenAdd(false)} closeText={'ยกเลิก'} 
          onOk={() => console.log('submit')} okText={'ยืนยัน'}
          centered size={'lg'}
        >
          <p class="text-body-tertiary lh-lg mb-0">{`ยืนยันรวบรวมเตรียมนำเสนอ จำนวน 1 ราย ,1 สัญญา ,ยอดเงินรวม 223,993.00 บาท`}</p>
        </AddModal>
      )}
      {isIncorrectAdd && (
        <Modal isOpen={isIncorrectAdd} setModal={setIncorrectAdd} 
          title={'รวบรวมเตรียมนำเสนอ'} 
          onClose={() => setIncorrectAdd(false)} closeText={'ปิด'} 
          onOk={() => console.log('submit')} okText={'ข้อมูลไม่ถูกต้องครบถ้วน'}
        >
        </Modal>
      )}
      <Loading isOpen={isLoadBigData} setModal={setLoadBigData} centered scrollable size={'lg'} title={'เรียกข้อมูลทะเบียนหนี้จาก BigData'} hideFooter>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className='mb-5' src={logo} alt='logo' width={150} height={150} />
          <Spinner className='mb-3' style={{ height: '3rem', width: '3rem' }} />
        </div>
      </Loading>
    </>
  );
};
export default NPL;