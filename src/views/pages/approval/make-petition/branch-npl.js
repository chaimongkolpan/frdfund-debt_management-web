import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData, getBookNo } from "@utils";
import According from "@views/components/panel/according";
import AddModal from "@views/components/modal/customModal";
import Modal from "@views/components/modal/fullModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/approval/filterMakePetitionBranch";
import SearchTable from "@views/components/approval/searchMakePetitionTable";
import SelectedTable from "@views/components/approval/selectMakePetitionTable";
import ConfirmTable from "@views/components/approval/confirmMakePetitionBranchTable";
import BookDateTable from "@views/components/approval/addBookDateTable";
import { 
  cleanData,
  searchMakePetition,
  getMakePetitionAddedList,
  addMakePetitionBranchList,
  removeMakePetitionBranchList,
  exportPetition,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPL = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [addPetition, setAddPetition] = useState(null);
  const [data, setData] = useState(null);
  const [addedData, setAddedData] = useState(null);
  const [makelistSelected, setMakeList] = useState(null);
  const [isSubmit, setSubmit] = useState(false);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [filter, setFilter] = useState(null);
  const [filterAdded, setFilterAdded] = useState({
    DebtClassifyStatus: 'เตรียมการชำระหนี้แทน(สาขา)',
    currentPage: 1,
    pageSize: 0
  });
  
  const onAddBigData = async (selected) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await addMakePetitionBranchList(ids);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData({ ...filterAdded, currentPage: 1 });
    }
  }
  const onRemoveMakelist = async (selected) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await removeMakePetitionBranchList(ids);
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
    setLoadBigData(true);
    if (addPetition) {
      const result = await exportPetition({ type: 'application/octet-stream', filename: 'จัดทำฎีกา_' + (new Date().getTime()) + '.zip', data: addPetition });
      if (result.isSuccess) {
        toast((t) => (
          <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
        ));
      }
      else {
        toast((t) => (
          <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
        ));
      }
    } else {
      alert('กรุณาบันทึกฎืกาก่อน ดาวน์โหลดเอกสาร');
    }
    setLoadBigData(false);
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatus: 'อยู่ระหว่างการโอนเงินให้สาขา' })
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
        <div className="d-flex flex-row-reverse">
          <div>
            <button type="button" className="btn btn-primary btn-sm ms-2" onClick={() => setOpenAdd(true)}>
              <span className="fas fa-plus"></span> เพิ่มเลขที่/วันที่หนังสือ
            </button>
          </div>
        </div>
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
              <According 
                title={'จัดทำฎีกา'}
                className={"mb-3"}
                children={(
                  <>
                    <SelectedTable result={addedData} handleSubmit={handleSubmit} handleRemove={onRemoveMakelist} filter={filterAdded} getData={fetchData}/>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      
      {isOpenAdd && (
        <AddModal isOpen={isOpenAdd} setModal={setOpenAdd} 
          title={'เพิ่มเลขที่/วันที่หนังสือฎีกา'} 
          onClose={() => setOpenAdd(false)} closeText={'ปิด'} 
          onOk={() => console.log('submit')} okText={'บันทึก'}
          size={'xl'}
        >
          <BookDateTable />
        </AddModal>
      )}
      <Modal isOpen={isSubmit} setModal={setSubmit} onOk={() => onSubmitMakelist()} onClose={onCloseMakelist}  title={'จัดทำฎีกา NPL'} okText={'ดาวน์โหลดเอกสาร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} setAddPetition={setAddPetition} />
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