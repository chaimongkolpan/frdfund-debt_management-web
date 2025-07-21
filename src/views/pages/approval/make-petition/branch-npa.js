import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap'
import { getUserData } from "@utils";
import According from "@views/components/panel/according";
import AddModal from "@views/components/modal/CustomModal";
import Modal from "@views/components/modal/FullModal";
import Loading from "@views/components/modal/loading";
import logo from '@src/assets/images/icons/logo.png'
import Filter from "@views/components/approval/filterMakePetitionNpa";
import SearchTable from "@views/components/approval/searchMakePetitionTableNpa";
import SelectedTable from "@views/components/approval/selectMakePetitionTableNpa";
import ConfirmTable from "@views/components/approval/confirmMakePetitionBranchTableNpa";
import BookDateTable from "@views/components/approval/addBookDateTableNpa";
import { 
  cleanData,
  searchMakePetitionNpa,
  getMakePetitionAddedListNpa,
  addMakePetitionBranchListNpa,
  removeMakePetitionBranchListNpa,
  exportPetitionNpa,
} from "@services/api";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";

const user = getUserData();
const NPA = () => {
  const navigate = useNavigate();
  const [isLoadBigData, setLoadBigData] = useState(false);
  const [petition, setPetition] = useState(null);
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
    const result = await addMakePetitionBranchListNpa(ids);
    if (result.isSuccess) {
      await onSearch(filter);
      await fetchData({ ...filterAdded, currentPage: 1 });
    }
  }
  const onRemoveMakelist = async (selected) => {
    const ids = selected.map((item) => item.id_debt_management);
    const result = await removeMakePetitionBranchListNpa(ids);
    if (result.isSuccess) {
      await fetchData(filterAdded)
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
    if (addPetition) {
      const result = await exportPetitionNpa({ type: 'application/octet-stream', filename: 'จัดทำฎีกา_' + (new Date().getTime()) + '.zip', data: addPetition });
      if (result.isSuccess) {
      }
    } else {
      alert('กรุณาบันทึกฎืกาก่อน ดาวน์โหลดเอกสาร');
    }
  }
  const onSearch = async (filter) => {
    setLoadBigData(true);
    setFilter({ ...filter, DebtClassifyStatus: 'อยู่ระหว่างการโอนเงินให้สาขา' })
    const result = await searchMakePetitionNpa(filter);
    if (result.isSuccess) {
      setData(result)
    } else {
      setData(null)
    }
    setLoadBigData(false);
  }
  const fetchData = async (query) => {
    setFilterAdded(query);
    const result = await getMakePetitionAddedListNpa(query);
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
        <h4 className="mb-3">ขออนุมัติชำระหนี้แทน NPA</h4>
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
      <Modal isOpen={isSubmit} setModal={setSubmit} hideOk={petition == null} onOk={() => onSubmitMakelist()} onClose={onCloseMakelist}  title={'จัดทำฎีกา NPA'} okText={'ดาวน์โหลดเอกสาร'} closeText={'ปิด'} scrollable>
        <ConfirmTable data={makelistSelected} setAddPetition={setPetition} />
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
export default NPA;