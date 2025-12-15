import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData, ToDateDb } from "@utils";
import According from "@views/components/panel/according";
import AddModal from "@views/components/modal/customModal";
import Modal from "@views/components/modal/fullModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/approval/filterMakePetition";
import SearchTable from "@views/components/approval/searchMakePetitionTable";
import SelectedTable from "@views/components/approval/selectMakePetitionTable";
import ConfirmTable from "@views/components/approval/confirmMakePetitionTable";
import BookDateTable from "@views/components/approval/addBookDateTable";
import { 
  cleanData,
  searchMakePetition,
  getMakePetitionAddedList,
  addMakePetitionList,
  removeMakePetitionList,
  exportPetition,
  insertPetition,
  savePetitionBook,
  updateNPLstatus,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const allow_roles = [1,2,7,8,9];
  const can_action = allow_roles.includes(user?.role)
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [petition, setPetition] = useState(null);
  const [addPetition, setAddPetition] = useState(null);
  const [savePetition, setSavePetition] = useState(null);
  const [loadPetition, setLoadPetition] = useState(false);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    DebtClassifyStatus: 'เตรียมการชำระหนี้แทน',
    currentPage: 1,
    pageSize: 0
  });
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
  const handleSavePetition = async (pet) => {
    const result = await savePetitionBook({ ...pet,debt_management_type: 'NPL',petition_date_office: ToDateDb(pet.petition_date_office) });
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await setLoadPetition(true);
    }
    else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  
  const handleOpenAdd = async () => {
    await setSavePetition(null);
    await setLoadPetition(true);
    await setOpenAdd(true);
  }
  const onSaveMakelist = async (pet) => {
    const result = await insertPetition(pet);
    if (result.isSuccess) {
      await updateNPLstatus(pet.ids, pet.debt_management_audit_status);
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await setPetition({
        ...pet,
        id_petition: result.data.id,
      });
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onCloseMakelist = async () => {
    await setSubmit(false);
    await setPetition(null);
    await fetchData({ ...filterAdded, currentPage: 1 });
  }
  const handleSubmit = async(selected) => {
    await setMakeList(selected);
    await setSubmit(true);
  }
  const onSubmitMakelist = async () => {
    setLoadBigData(true);
    if (petition) {
      const result = await exportPetition({ type: 'application/octet-stream', filename: 'จัดทำฎีกา_' + (new Date().getTime()) + '.zip', data: petition });
      if (result.isSuccess) {
      }
    } else {
      alert('กรุณาบันทึกฎืกาก่อน ดาวน์โหลดเอกสาร');
    }
    setLoadBigData(false);
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatusList: ['ยืนยันยอดสำเร็จ','อยู่ระหว่างการโอนเงินให้สาขา','อยู่ระหว่างการชำระหนี้แทน','เตรียมการชำระหนี้แทน(สาขา)'], })
    const result = await searchMakePetition(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getMakePetitionAddedList(query);
    if (result.isSuccess) {
      setAddedData(result)
    } else {
      setAddedData(null)
    }
  }
  useEffect(() => {
  },[data])
  useEffect(() => {
    setLoadBigData(true);
    fetchData(filterAdded);
    return cleanData
  },[])
  return (
    <>
      <div className="content">
        <h4 className="mb-3">ขออนุมัติชำระหนี้แทน NPL</h4>
        {can_action && (
          <div className="d-flex flex-row-reverse">
            <div>
              <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => handleOpenAdd()}>
                <span className="fas fa-plus"></span> เพิ่มเลขที่/วันที่หนังสือ
              </button>
            </div>
          </div>
        )}
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
                      <SearchTable result={data} handleSubmit={onAddBigData} filter={filter} getData={onSearch} can_action={can_action} />
                    )}
                  </>
                )}
              />
              {can_action && (
                <According 
                  title={'จัดทำฎีกา'}
                  className={"mb-3"}
                  children={(
                    <>
                      <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                    </>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isOpenAdd && (
        <AddModal isOpen={isOpenAdd} setModal={setOpenAdd} 
          title={'เพิ่มเลขที่/วันที่หนังสือฎีกา'} 
          onClose={() => setOpenAdd(false)} closeText={'ปิด'} 
          onOk={() => handleSavePetition(savePetition)} okText={'บันทึก'}
          size={'xl'}
        >
          <BookDateTable savePetition={savePetition} setSavePetition={setSavePetition} loadPetition={loadPetition} setLoadPetition={setLoadPetition} />
        </AddModal>
      )}
      <Modal isOpen={isSubmit} setModal={setSubmit} hideOk={petition == null} onOk={() => onSubmitMakelist()} onClose={onCloseMakelist}  title={'จัดทำฎีกา NPL'} okText={'ดาวน์โหลดเอกสาร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} setAddPetition={onSaveMakelist} petition={petition}/>
      </Modal>
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